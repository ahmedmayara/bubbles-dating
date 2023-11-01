import { getAllInvitations } from "@/actions/actions";
import React from "react";
import { InvitationListItem } from "./invitations-list-item";

interface InvitationListProps {
  invitations: Awaited<ReturnType<typeof getAllInvitations>>;
}

export function InvitationsList({ invitations }: InvitationListProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-full overflow-y-auto border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="py-4 text-2xl font-bold text-foreground">
            Invitations
          </div>
        </div>
        {invitations.map((item) => (
          <InvitationListItem key={item.id} invitation={item} />
        ))}
      </div>
    </aside>
  );
}
