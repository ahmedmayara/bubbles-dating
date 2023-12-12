"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { User } from "@prisma/client";
import { setAccountStatus } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";

interface UsersTableActionsProps<TData> {
  row: Row<TData>;
}

export function UsersTableActions<TData>({
  row,
}: UsersTableActionsProps<TData>) {
  const user = row.original as User;
  const [status, setStatus] = React.useState(user.status);
  const router = useRouter();
  async function handleValueChange(value: string) {
    if (value === "ACTIVE") {
      setStatus("ACTIVE");
      await setAccountStatus(user.id, "ACTIVE");
      router.refresh();
    } else if (value === "DISABLED") {
      setStatus("DISABLED");
      await setAccountStatus(user.id, "DISABLED");
      router.refresh();
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/reports/${user.id}`)}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Account status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={handleValueChange}
              >
                <DropdownMenuRadioItem
                  value="ACTIVE"
                  disabled={status === "ACTIVE"}
                >
                  Active
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="DISABLED"
                  disabled={status === "DISABLED"}
                >
                  Disabled
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
