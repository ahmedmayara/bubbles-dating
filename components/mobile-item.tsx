import Link from "next/link";

import { cn } from "@/lib/utils";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

export function MobileItem({
  href,
  icon: Icon,
  active,
  onClick,
}: MobileItemProps) {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      onClick={handleClick}
      href={href}
      className={cn(
        "group flex w-full justify-center gap-x-3 p-4 text-sm font-semibold leading-6 text-muted-foreground hover:bg-accent hover:text-foreground",
        active && "bg-accent text-foreground",
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
