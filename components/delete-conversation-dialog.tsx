"use client";

import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import { Trash2Icon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { deleteConversation } from "@/actions/actions";
import { useRouter } from "next/navigation";

interface DeleteConversationDialogProps {
  conversationId: string;
}

export function DeleteConversationDialog({
  conversationId,
}: DeleteConversationDialogProps) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this conversation? This action
            cannot be undone, and all messages will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteConversation(conversationId).then(() => {
                router.push("/app/conversations");
              })
            }
            className={buttonVariants({ variant: "destructive" })}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
