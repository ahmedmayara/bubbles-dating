"use client";

import useActiveList from "@/hooks/useActiveList";
import { User } from "@prisma/client";

interface ActiveTextProps {
  user: User;
}

export function ActiveText({ user }: ActiveTextProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div className="text-xs text-muted-foreground">
      {isActive ? <span>Active now</span> : <span>Offline</span>}
    </div>
  );
}
