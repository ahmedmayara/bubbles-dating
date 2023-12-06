import { Message, User } from "@prisma/client";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { getMessages } from "@/actions/actions";

import { format } from "date-fns";

interface MessageBoxProps {
  message: Awaited<ReturnType<typeof getMessages>>[0];
  currentUser: User;
}

export function MessageBox({ message, currentUser }: MessageBoxProps) {
  const isSender = (message: Message) => {
    return message.senderId === currentUser.id;
  };
  return (
    <div className={cn("flex gap-3 p-4", isSender(message) && "justify-end")}>
      <div className={cn(isSender(message) && "order-2")}>
        <Avatar>
          <AvatarImage src={message.sender.image!} alt={message.sender.name!} />
          <AvatarFallback>
            {message.sender.name!.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div
        className={cn("flex flex-col gap-2", isSender(message) && "items-end")}
      >
        <div className="flex items-center gap-1">
          <div className="text-sm font-medium text-muted-foreground">
            {message.sender.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>

        <div
          className={cn(
            "w-fit max-w-sm overflow-hidden rounded-xl px-3 py-2 text-sm",
            isSender(message) ? "bg-primary text-white" : "bg-gray-200",
          )}
        >
          {message.body}
        </div>

        <div className="text-xs text-muted-foreground">
          {format(new Date(message.createdAt), "EEEE, MMMM do")}
        </div>
      </div>
    </div>
  );
}
