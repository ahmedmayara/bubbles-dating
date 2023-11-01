import getCurrentUser, {
  getConversation,
  getMessages,
} from "@/actions/actions";
import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { GhostIcon } from "lucide-react";
import { Message } from "@prisma/client";
import { MessageBox } from "./message-box";

interface ConversationBodyProps {
  conversationId: string;
}

export async function ConversationBody({
  conversationId,
}: ConversationBodyProps) {
  const conversation = await getConversation(conversationId);
  const messages = await getMessages(conversationId);
  const currentUser = await getCurrentUser();

  const isSender = (message: Message) => {
    return message.senderId === currentUser.id;
  };
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 && <EmptyState />}
      {conversation.messages.map((message) => (
        <MessageBox
          key={message.id}
          message={message}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <GhostIcon className="h-16 w-16 text-muted-foreground" />
      <div className="text-2xl font-semibold text-muted-foreground">
        No messages yet
      </div>
      <div className="text-sm text-muted-foreground">
        Start a conversation by typing a message
      </div>
    </div>
  );
}
