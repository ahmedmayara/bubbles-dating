import { getAllUsers } from "@/actions/actions";
import { Sidebar } from "@/components/sidebar";
import { UsersList } from "@/components/users-list";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const users = await getAllUsers();
  return (
    <Sidebar>
      <div className="h-full">
        {/* @ts-ignore */}
        <UsersList users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
