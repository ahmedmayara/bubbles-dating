import { getAllInvitations } from "@/actions/actions";
import React from "react";
import { UserButton } from "./user-button";
import { Button } from "./ui/button";
import AcceptInvitationButton from "./accept-invitation-button";
import { format } from "date-fns";

interface InvitationListItemProps {
  invitation: Awaited<ReturnType<typeof getAllInvitations>>[0];
}

export function InvitationListItem({ invitation }: InvitationListItemProps) {
  return (
    <>
      <div className="relative flex w-full flex-col rounded-lg bg-accent p-4">
        <div className="flex items-center gap-2">
          <UserButton currentUser={invitation.sender} />
          <p className="text-sm font-medium text-foreground">
            {invitation.sender.name}
          </p>
        </div>

        <div className="pt-2 text-xs text-muted-foreground">
          <p>
            Sent on {format(invitation.createdAt, "MMMM dd, yyyy").toString()}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <AcceptInvitationButton id={invitation.sender.id} />
          <Button size={"sm"} variant={"outline"}>
            Decline
          </Button>
        </div>
      </div>
    </>
  );
}
