"use server";

import bcrypt from "bcrypt";
import { db } from "@/db/db";
import { NextResponse } from "next/server";
import { SignUpSchemaType, signUpSchema } from "@/schemas/schemas";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export default async function getCurrentUser() {
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

    return currentUser;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
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

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        NOT: {
          email: session.user.email,
        },
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
// export async function sendInvitation(id:string) {
//   try {
//     const session = await getSession();

//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { message: "Not authenticated" },
//         { status: 401 },
//       );
//     }

//     const currentUser = await db.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!currentUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const invitedUser = await db.user.findUnique({
//       where: { id },
//     });

//     if (!invitedUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const invitation = await db.invitation.create({
//       data: {
//         invitedBy: {
//           connect: {
//             id: currentUser.id,
//           },
//         },
//         invitedUser: {
//           connect: {
//             id: invitedUser.id,
//           },
//         },
//       },
//     });

//     return invitation;
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }
