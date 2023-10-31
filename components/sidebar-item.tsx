import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SidebarItemProps {
  label: string;
  icon: React.ElementType;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

export function SidebarItem({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}: SidebarItemProps) {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li onClick={handleClick} key={label}>
            <Link
              href={href}
              className={cn(
                "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-muted-foreground transition duration-150 ease-in-out hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground focus:outline-none",
                active && "bg-accent text-foreground",
              )}
            >
              <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </Link>
          </li>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="mb-3.5">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
