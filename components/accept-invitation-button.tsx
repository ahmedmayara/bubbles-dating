"use client";

import React from "react";
import { Button } from "./ui/button";
import { createConversation } from "@/actions/actions";

interface AcceptInvitationButtonProps {
  id: string;
}

export default function AcceptInvitationButton({
  id,
}: AcceptInvitationButtonProps) {
  return (
    <Button size="sm" variant="success" onClick={() => createConversation(id)}>
      Accept
    </Button>
  );
}
