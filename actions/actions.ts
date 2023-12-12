"use server";

import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import {
  ReportUserSchemaType,
  SetupAccountSchemaType,
  SignUpSchemaType,
  setupAccountSchema,
  signUpSchema,
} from "@/schemas/schemas";

export interface GetAllUsersFilters {
  gender?: string;
  location?: string;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

export async function signUp(data: SignUpSchemaType) {
  try {
    const validation = signUpSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const { name, email, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json(
        "Something went wrong. Please try again later.",
        { status: 500 },
      );
    }

    return user;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser(): Promise<User> {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    return currentUser;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function getAllUsers(filters: GetAllUsersFilters) {
  try {
    const session = await getSession();

    const { gender, location } = filters;

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    let query: any = {};

    if (gender) {
      query.gender = gender;
    }

    if (location) {
      query.country = location;
    }

    const users = await db.user.findMany({
      where: {
        ...query,
        NOT: [
          {
            email: session.user.email,
          },
          {
            reportedMe: {
              some: {
                reporter: {
                  email: session.user.email,
                },
              },
            },
          },
          {
            conversations: {
              some: {
                participants: {
                  some: {
                    email: session.user.email,
                  },
                },
              },
            },
          },
          {
            invitationsSent: {
              some: {
                receiver: {
                  email: session.user.email,
                },
              },
            },
          },
          {
            invitationsReceived: {
              some: {
                sender: {
                  email: session.user.email,
                },
              },
            },
          },
        ],
      },
    });

    return users;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function sendInvitation(id: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const invitedUser = await db.user.findUnique({
      where: { id },
    });

    if (!invitedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const invitation = await db.invitation.create({
      data: {
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        receiver: {
          connect: {
            id: invitedUser.id,
          },
        },
      },
    });

    return invitation;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function getAllInvitations() {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  const invitations = await db.invitation.findMany({
    where: {
      receiverId: currentUser.id,
      status: "PENDING",
    },
    include: {
      sender: true,
    },
  });

  return invitations;
}

export async function createConversation(id: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const invitedUser = await db.user.findUnique({
      where: { id },
    });

    if (!invitedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const conversation = await db.conversation.create({
      data: {
        participants: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: invitedUser.id,
            },
          ],
        },
      },
    });

    // update invitation status
    await db.invitation.updateMany({
      where: {
        AND: [
          {
            receiverId: currentUser.id,
          },
          {
            senderId: invitedUser.id,
          },
        ],
      },
      data: {
        status: "ACCEPTED",
      },
    });

    revalidatePath("/invitations");

    return conversation;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function getAllConversations() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            id: currentUser.id,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    return conversations;
  } catch (error) {
    throw new Error("Something went wrong" + error);
  }
}

export async function getConversation(id: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id,
      },
      include: {
        participants: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return conversation;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function getMessages(conversationId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
    });

    return messages;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

export async function createMessage(conversationId: string, message: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
        messages: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 },
      );
    }

    const newMessage = await db.message.create({
      data: {
        body: message,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        sender: true,
      },
    });

    await pusherServer.trigger(
      `conversation-${conversationId}`,
      "messages:new",
      newMessage,
    );

    return newMessage;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        participants: true,
        messages: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 },
      );
    }

    const deletedConversation = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        participantsIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    revalidatePath("/conversations");

    return deletedConversation;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function setUpAccount(data: SetupAccountSchemaType) {
  try {
    const validation = setupAccountSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const {
      name,
      email,
      birthdate,
      image,
      bio,
      occupation,
      country,
      city,
      gender,
    } = data;

    const currentUser = await db.user.findUnique({
      where: { email },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await db.user.update({
      where: { email },
      data: {
        name,
        birthdate,
        gender,
        image,
        bio,
        occupation,
        country: country.label,
        city,
      },
    });

    return updatedUser;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function blockUser(id: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return {
        message: "Not authenticated",
      };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return {
        message: "Current user not found",
      };
    }

    const blockedUser = await db.user.findUnique({
      where: { id },
    });

    if (!blockedUser) {
      return {
        message: "Blocked user not found",
      };
    }
    const block = await db.block.create({
      data: {
        blocker: {
          connect: {
            id: currentUser.id,
          },
        },
        blocked: {
          connect: {
            id: blockedUser.id,
          },
        },
      },
    });

    await db.conversation.updateMany({
      where: {
        participantsIds: {
          hasEvery: [currentUser.id, blockedUser.id],
        },
      },
      data: {
        status: "BLOCKED",
        conversationBlockedBy: currentUser.id,
      },
    });

    // Increment the blocked user's total blocks
    await db.user.update({
      where: {
        id: blockedUser.id,
      },
      data: {
        totalBlocks: {
          increment: 1,
        },
      },
    });

    const idOfconversation = await db.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [currentUser.id, blockedUser.id],
        },
      },
    });
    revalidatePath(`/app/conversations/${idOfconversation}`);

    return block;
  } catch (error) {
    console.error("Error in blokceUser function:", error);
    return {
      message: "An error occurred",
    };
  }
}

export async function getMyUserblockd() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return {
        message: "Not authenticated",
      };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return {
        message: "Current user not found",
      };
    }

    const blockedUser = await db.block.findMany({
      where: {
        blockerId: currentUser.id,
      },
      include: {
        blocked: true,
      },
    });

    return blockedUser;
  } catch (error) {
    console.error("Error in blockUser function:", error);
    return {
      message: "An error occurred",
    };
  }
}

export async function deblockUser(id: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return {
        message: "Not authenticated",
      };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return {
        message: "Current user not found",
      };
    }

    const deblockedUser = await db.block.deleteMany({
      where: {
        blockerId: currentUser.id,
        blockedId: id,
      },
    });

    const updatestatusofconversation = await db.conversation.updateMany({
      where: {
        participantsIds: {
          hasEvery: [currentUser.id, id],
        },
      },
      data: {
        status: "ACTIVE",
      },
    });

    revalidatePath("/app");

    return deblockedUser;
  } catch (error) {
    console.error("Error in unblockUser function:", error);
    return {
      message: "An error occurred",
    };
  }
}

export async function reportUser(id: string, reason: ReportUserSchemaType) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return {
        message: "Not authenticated",
      };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return {
        message: "Current user not found",
      };
    }

    const user = await db.report.create({
      data: {
        reporter: {
          connect: {
            id: currentUser.id,
          },
        },
        reported: {
          connect: {
            id: id,
          },
        },
        reason: reason.reason,
      },
    });

    // Increment the reported user's total reports
    await db.user.update({
      where: {
        id: id,
      },
      data: {
        totalReports: {
          increment: 1,
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error in reportUser function:", error);
    return {
      message: "An error occurred",
    };
  }
}

export async function setAccountStatus(
  id: string,
  status: "ACTIVE" | "DISABLED",
) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return {
        message: "Not authenticated",
      };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return {
        message: "Current user not found",
      };
    }

    const user = await db.user.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in SET-ACCOUNT-STATUS function:", error);
    return {
      message: "An error occurred",
    };
  }
}

export async function getStatusOfUser(email: string) {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return false;
  }
  if (user.status === "ACTIVE") return true;
  else return false;
}

export async function getReportsById(id: string) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return {
        message: "Not authenticated",
      };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return {
        message: "Current user not found",
      };
    }

    const reports = await db.report.findMany({
      where: {
        reportedId: id,
      },
      include: {
        reporter: true,
        reported: true,
      },
    });

    return reports;
  } catch (error) {
    console.error("Error in getReportsById function:", error);
    return {
      message: "An error occurred",
    };
  }
}
