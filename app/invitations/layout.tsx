import { getAllInvitations } from "@/actions/actions";
import { InvitationsList } from "@/components/invitations-list";
import { Sidebar } from "@/components/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const invitations = await getAllInvitations();
  return (
    <Sidebar>
      <div className="h-full">
        {/* @ts-ignore */}
        <InvitationsList invitations={invitations} />
        {children}
      </div>
    </Sidebar>
  );
}
