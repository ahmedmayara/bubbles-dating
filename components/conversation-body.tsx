"use client";

import getCurrentUser, {
  getConversation,
  getMessages,
} from "@/actions/actions";
import { GhostIcon } from "lucide-react";
import { MessageBox } from "./message-box";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface ConversationBodyProps {
  conversation: Awaited<ReturnType<typeof getConversation>>;
  initialMessages: Awaited<ReturnType<typeof getMessages>>;
  currentUser: Awaited<ReturnType<typeof getCurrentUser>>;
}

type Message = Awaited<ReturnType<typeof getMessages>>[0];

export function ConversationBody({
  conversation,
  initialMessages,
  currentUser,
}: ConversationBodyProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(`conversation-${conversation.id}`);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (message: Message) => {
      setMessages((currentMessages) => {
        if (find(currentMessages, { id: message.id })) {
          return currentMessages;
        }
        return [...currentMessages, message];
      });

      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    pusherClient.bind("messages:new", messageHandler);

    return () => {
      pusherClient.unsubscribe(`conversation-${conversation.id}`);
      pusherClient.unbind("messages:new");
    };
  }, [conversation.id]);

  return (
    <div className="flex-1 overflow-y-auto">
      {initialMessages.length === 0 && <EmptyState />}
      {messages.map((message) => (
        <MessageBox
          key={message.id}
          message={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} className="pt-20" />
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
