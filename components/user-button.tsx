"use client";

import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import useActiveList from "@/hooks/useActiveList";

interface UserButtonProps {
  currentUser: User;
}

export function UserButton({ currentUser }: UserButtonProps) {
  const { members } = useActiveList();

  const isActive = members.indexOf(currentUser?.email!) !== -1;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.image!} alt={currentUser.name!} />
              <AvatarFallback className="uppercase">
                {currentUser.name![0]}
              </AvatarFallback>
            </Avatar>

            {isActive && (
              <div className="absolute bottom-0 right-0">
                <div className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-background bg-green-500">
                  <span className="sr-only">Online</span>
                </div>
              </div>
            )}
          </div>
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
                defaultMonth={new Date(currentUser.birthdate!)}
                selected={new Date(currentUser.birthdate!)}
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
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={currentUser.country!} />
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={currentUser.city!} />
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea rows={8} id="bio" value={currentUser.bio!}>
            {currentUser.bio}
          </Textarea>
        </div>

        <SheetFooter className="pt-10">
          <Button variant={"outline"} className="w-full">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
