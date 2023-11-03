import getCurrentUser, { getConversation } from "@/actions/actions";
import React from "react";
import { HiChevronLeft } from "react-icons/hi";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronLeft, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { DeleteConversationDialog } from "./delete-conversation-dialog";

interface ConversationHeaderProps {
  conversationId: string;
}

export async function ConversationHeader({
  conversationId,
}: ConversationHeaderProps) {
  const conversation = await getConversation(conversationId);
  const currentUser = await getCurrentUser();
  const user = conversation?.participants.find(
    (participant) => participant.id !== currentUser.id,
  );
  return (
    <div className="flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/app/conversations"
          className="block cursor-pointer text-primary transition lg:hidden"
        >
          <ChevronLeft size={25} />
        </Link>
        <Avatar>
          <AvatarImage src={user?.image!} alt={user?.name!} />
          <AvatarFallback>
            <span>{user?.name![0]}</span>
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div>
            <span className="font-semibold text-foreground">{user?.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <span>
              Joined on{" "}
              {format(new Date(user?.createdAt!), "MMMM dd, yyyy").toString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              className="data-[state=open]:bg-muted"
            >
              <MoreHorizontalIcon className="h-5 w-5 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Block</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteConversationDialog conversationId={conversationId} />
      </div>
    </div>
  );
}
