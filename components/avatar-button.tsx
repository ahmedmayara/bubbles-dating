"use client";

import { User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useActiveList from "@/hooks/useActiveList";

interface AvatarButtonProps {
  user: User;
}

export function AvatarButton({ user }: AvatarButtonProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div className="relative">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.image!} alt={user.name!} />
        <AvatarFallback className="uppercase">{user.name![0]}</AvatarFallback>
      </Avatar>

      {isActive && (
        <div className="absolute bottom-0 right-0">
          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-green-500">
            <span className="sr-only">Online</span>
          </div>
        </div>
      )}
    </div>
  );
}
