"use client";

import { User } from "@prisma/client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { EyeIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";

interface ViewProfileDialogProps {
  user: User;
}

export function ViewProfileDialog({ user }: ViewProfileDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.image!} alt={user?.name!} />
            <AvatarFallback>
              <span>{user?.name![0]}</span>
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-2">
            <div>
              <span className="font-semibold text-foreground">
                {user?.name},{" "}
                <span className="text-muted-foreground">
                  {new Date().getFullYear() -
                    new Date(user?.birthdate!).getFullYear()}
                </span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span>
                Joined on{" "}
                {format(new Date(user?.createdAt!), "MMMM dd, yyyy").toString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <div>
              <span className="text-sm font-semibold text-foreground">Bio</span>
            </div>
            <div className="text-left text-sm text-muted-foreground">
              <span>{user?.bio}</span>
            </div>

            <div className="flex flex-col items-start gap-2">
              <span className="text-sm font-semibold text-foreground">
                Location
              </span>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{user?.country + ", " + user?.city}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
