"use client";

import getCurrentUser, {
  getConversation,
  getMessages,
} from "@/actions/actions";
import { GhostIcon } from "lucide-react";
import { MessageBox } from "./message-box";
import { useEffect, useRef } from "react";

interface ConversationBodyProps {
  conversation: Awaited<ReturnType<typeof getConversation>>;
  initialMessages: Awaited<ReturnType<typeof getMessages>>;
  currentUser: Awaited<ReturnType<typeof getCurrentUser>>;
}

export function ConversationBody({
  conversation,
  initialMessages,
  currentUser,
}: ConversationBodyProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.id]);

  return (
    <div className="flex-1 overflow-y-auto">
      {initialMessages.length === 0 && <EmptyState />}
      {conversation.messages.map((message) => (
        <MessageBox
          key={message.id}
          message={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} className="pt-12" />
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
