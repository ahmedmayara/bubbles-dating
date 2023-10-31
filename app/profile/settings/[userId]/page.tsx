import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import Image from "next/image";
import React from "react";

interface Props {
  userId: string;
}

export default async function Page({ params }: { params: Props }) {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  return (
    <div>
      <h1>Profile Settings</h1>
      <Input value={user?.name!} />

      <Avatar className="mb-4 h-16 w-16">
        <AvatarImage src={user?.image!} alt={user?.name!} />
        <AvatarFallback>{user?.name![0]}</AvatarFallback>
      </Avatar>
    </div>
  );
}
