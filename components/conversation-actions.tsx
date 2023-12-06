"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { blockUser, deblockUser } from "@/actions/actions";

interface ConversationActionsProps {
  userId: string;

  status: string;
  meOrnot: boolean;
}

export function ConversationActions({
  userId,
  status,
  meOrnot,
}: ConversationActionsProps) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {meOrnot && (
          <DropdownMenuItem
            onClick={() => {
              if (status === "ACTIVE") {
                blockUser(userId).then(() => {
                  router.refresh();
                });
              } else if (status === "BLOCKED" && meOrnot) {
                deblockUser(userId).then(() => {
                  router.refresh();
                });
              }
            }}
          >
            {status === "ACTIVE" && "Block"}
            {status === "BLOCKED" && meOrnot && "Unblock"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>Report</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
