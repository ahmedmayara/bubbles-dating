"use server";

import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import {
  SignUpSchemaType,
  UpdateProfileSchemaType,
  signUpSchema,
  updateProfileSchema,
} from "@/schemas/schemas";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";

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

export async function getAllUsers() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Get all the users except the current user and the users that the current user has already invited them
    const users = await db.user.findMany({
      where: {
        NOT: [
          {
            email: session.user.email,
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
    throw new Error("Something went wrong");
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
    });

    revalidatePath(`/conversations/${conversationId}`);

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

export async function updateProfile(data: UpdateProfileSchemaType) {
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

    const validation = updateProfileSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const { name, image, birthdate, location, occupation, bio } = data;

    const updatedUser = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        image,
        birthdate,
        location,
        occupation,
        bio,
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
