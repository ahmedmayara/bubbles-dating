"use client";

import {
  HomeIcon,
  LogOutIcon,
  MessagesSquare,
  UserPlusIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { MobileItem } from "./mobile-item";
import { usePathname } from "next/navigation";

export function MobileFooter() {
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
    <div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t-[1px] bg-background lg:hidden">
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
}
