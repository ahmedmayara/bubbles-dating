"use client";

import { User } from "@prisma/client";
import { SidebarItem } from "./sidebar-item";
import {
  HomeIcon,
  LogOutIcon,
  MessagesSquare,
  UserPlusIcon,
} from "lucide-react";
import { UserButton } from "./user-button";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FilterDialog } from "./filter-dialog";

interface DesktopSidebarProps {
  currentUser: User;
}

export function DesktopSidebar({ currentUser }: DesktopSidebarProps) {
  const pathname = usePathname();
  const routes = [
    {
      label: "Home",
      href: "/app",
      icon: HomeIcon,
      active: pathname === "/app",
      onClick: () => {},
    },
    {
      label: "Conversations",
      href: "/app/conversations",
      icon: MessagesSquare,
      active: pathname === "/app/conversations",
      onClick: () => {},
    },
    {
      label: "Invitations",
      href: "/invitations",
      icon: UserPlusIcon,
      active: pathname === "/invitations",
      onClick: () => {},
    },
    {
      label: "Sign Out",
      href: "#",
      icon: LogOutIcon,
      active: false,
      onClick: () => signOut(),
    },
  ];
  return (
    <>
      <aside className="hidden justify-between bg-background lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r-[1px] lg:pb-4 xl:px-6">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-2">
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
            <FilterDialog />
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between">
          <UserButton currentUser={currentUser} />
        </nav>
      </aside>
    </>
  );
}
