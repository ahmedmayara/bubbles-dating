"use client";

import { User } from "@prisma/client";
import { SidebarItem } from "./sidebar-item";
import { BellIcon, HomeIcon, LogOutIcon, MessagesSquare } from "lucide-react";
import { UserButton } from "./user-button";
import { signOut } from "next-auth/react";

interface DesktopSidebarProps {
  currentUser: User;
}

export function DesktopSidebar({ currentUser }: DesktopSidebarProps) {
  const routes = [
    {
      label: "Home",
      href: "/app",
      icon: HomeIcon,
      active: true,
      onClick: () => {},
    },
    {
      label: "Messages",
      href: "/app/messages",
      icon: MessagesSquare,
      active: false,
      onClick: () => {},
    },
    {
      label: "Notifications",
      href: "#",
      icon: BellIcon,
      active: false,
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
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between">
          <UserButton currentUser={currentUser} />
        </nav>
      </aside>
    </>
  );
}
