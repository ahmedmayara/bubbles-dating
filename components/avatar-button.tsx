"use client";

import { User } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useActiveList from "@/hooks/useActiveList";
import { cn } from "@/lib/utils";

interface AvatarButtonProps {
  user: User;
  className?: string;
  activeSize?: "small" | "large";
}

export function AvatarButton({
  user,
  className,
  activeSize,
}: AvatarButtonProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div className="relative">
      <Avatar className={cn("h-16 w-16", className)}>
        <AvatarImage src={user.image!} alt={user.name!} />
        <AvatarFallback className="uppercase">{user.name![0]}</AvatarFallback>
      </Avatar>

      {isActive && (
        <div className="absolute bottom-0 right-0">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-green-500",
              {
                "h-3 w-3": activeSize === "small",
                "h-5 w-5": activeSize === "large",
              },
            )}
          >
            <span className="sr-only">Online</span>
          </div>
        </div>
      )}
    </div>
  );
}
