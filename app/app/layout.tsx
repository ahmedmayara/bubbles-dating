import { getAllConversations } from "@/actions/actions";
import { Sidebar } from "@/components/sidebar";
import { ConversationsList } from "@/components/conversations-list";
import React from "react";
import { ConversationsSearch } from "@/components/conversations-search";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const conversations = await getAllConversations();
  return (
    <Sidebar>
      <div className="h-full">
        <ConversationsList conversations={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
