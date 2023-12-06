"use client";

import { getAllConversations } from "@/actions/actions";
import { UserButton } from "./user-button";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

interface MobileConversationsListItemProps {
  conversation: Awaited<ReturnType<typeof getAllConversations>>[0];
  currentUser: User;
}

export function MobileConversationsListItem({
  conversation,
  currentUser,
}: MobileConversationsListItemProps) {
  const router = useRouter();

  async function handleClick() {
    router.push(`/app/conversations/${conversation.id}`);
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="relative flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-accent p-3 transition hover:bg-background/80"
      >
        {conversation.participants.map((user) => {
          if (user.id !== currentUser.id) {
            return <UserButton key={user.id} currentUser={user} />;
          }
        })}
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {conversation.participants.map((user) => {
                  if (user.id !== currentUser.id) {
                    return user.name;
                  }
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
