"use client";

import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge, badgeVariants } from "./ui/badge";
import { cn } from "@/lib/utils";

import { interests } from "@/schemas/schemas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

interface UserButtonProps {
  currentUser: User;
}

export function UserButton({ currentUser }: UserButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.image!} alt={currentUser.name!} />
            <AvatarFallback>{currentUser.name![0]}</AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Manage your account and settings.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentUser.image!} alt={currentUser.name!} />
            <AvatarFallback>{currentUser.name![0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={currentUser.name!} />
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="name">Birthdate</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !currentUser.birthdate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentUser.birthdate ? (
                  format(currentUser.birthdate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                className="w-full"
                selected={currentUser.birthdate || undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={currentUser.email!} disabled />
        </div>
        <div className="mt-6 grid gap-2">
          <Label>Location</Label>
          <Input value={currentUser.location!} />
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea rows={8} id="bio" value={currentUser.bio!}>
            {currentUser.bio}
          </Textarea>
        </div>

        <SheetFooter className="mt-32">
          <Button variant={"outline"} className="w-full">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
