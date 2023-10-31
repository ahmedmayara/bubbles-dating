import { User } from "@prisma/client";
import React from "react";
import { UserItem } from "./user-item";

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-full overflow-y-auto border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="py-4 text-2xl font-bold text-foreground">
            Conversations
          </div>
        </div>
        {users.map((item) => (
          <UserItem key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
}
