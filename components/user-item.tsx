import { User } from "@prisma/client";

import { UserButton } from "./user-button";

interface UserBoxProps {
  data: User;
}

export function UserItem({ data }: UserBoxProps) {
  return (
    <>
      <div className="relative flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-background p-3 transition hover:bg-accent">
        <UserButton currentUser={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
