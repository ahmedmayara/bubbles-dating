"use client";

import { BellIcon, HomeIcon, LogOutIcon, MessagesSquare } from "lucide-react";
import { signOut } from "next-auth/react";
import { MobileItem } from "./mobile-item";

export function MobileFooter() {
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
    <div
      className="
        fixed 
        bottom-0 
        z-40 
        flex 
        w-full 
        items-center 
        justify-between 
        border-t-[1px] 
        bg-background
        lg:hidden
      "
    >
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
