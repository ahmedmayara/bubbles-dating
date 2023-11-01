"use client";

import { useRouter } from "next/navigation";
import { UserButton } from "./user-button";
import getCurrentUser, {
  getAllConversations,
  getConversation,
} from "@/actions/actions";

interface UserBoxProps {
  data: Awaited<ReturnType<typeof getAllConversations>>[0];
  currentUser: Awaited<ReturnType<typeof getCurrentUser>>;
}

export function ConversationsListItem({ data, currentUser }: UserBoxProps) {
  const router = useRouter();

  async function handleClick() {
    const conversation = await getConversation(data.id);
    console.log(conversation);
    router.push(`/app/conversations/${conversation.id}`);
  }
  return (
    <>
      <div
        onClick={handleClick}
        className="relative flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-background p-3 transition hover:bg-accent"
      >
        {data.participants.map((user) => {
          if (user.id !== currentUser.id) {
            return <UserButton key={user.id} currentUser={user} />;
          }
        })}
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {data.participants.map((user) => {
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
