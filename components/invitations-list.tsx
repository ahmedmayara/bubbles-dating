import { getAllInvitations } from "@/actions/actions";
import React from "react";
import { InvitationListItem } from "./invitations-list-item";
import { GhostIcon } from "lucide-react";

interface InvitationListProps {
  invitations: Awaited<ReturnType<typeof getAllInvitations>>;
}

export function InvitationsList({ invitations }: InvitationListProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-full overflow-y-auto border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="gap-2 py-4 text-foreground">
            <p className="text-2xl font-bold">Invitations</p>
            <p className="text-sm text-muted-foreground">
              Get to know the people who liked you!
            </p>
          </div>
        </div>
        {invitations.map((item) => (
          <InvitationListItem key={item.id} invitation={item} />
        ))}

        {invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted p-4">
              <GhostIcon className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                No invitations found
              </p>
              <span className="text-center text-xs text-muted-foreground">
                You can invite people by matching with them!
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
