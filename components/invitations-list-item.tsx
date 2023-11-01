import { getAllInvitations } from "@/actions/actions";
import React from "react";
import { UserButton } from "./user-button";
import { Button } from "./ui/button";
import AcceptInvitationButton from "./accept-invitation-button";

interface InvitationListItemProps {
  invitation: Awaited<ReturnType<typeof getAllInvitations>>[0];
}

export function InvitationListItem({ invitation }: InvitationListItemProps) {
  return (
    <>
      <div className="relative flex w-full">
        <UserButton currentUser={invitation.sender} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {invitation.sender.name}
              </p>

              <div className="flex items-center justify-end space-x-2">
                <Button variant="secondary" size="sm">
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AcceptInvitationButton id={invitation.sender.id} />
    </>
  );
}
