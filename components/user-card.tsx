"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { BriefcaseIcon, MapPinIcon, XIcon } from "lucide-react";
import { AiFillHeart } from "react-icons/ai";
import { IoIosWarning } from "react-icons/io";

import Cards, { Card } from "react-swipe-card";
import { getAllInvitations, sendInvitation } from "@/actions/actions";

interface UserCardProps {
  users: User[];
  invitations: Awaited<ReturnType<typeof getAllInvitations>>;
}

export function UserCard({ users, invitations }: UserCardProps) {
  console.log(users);
  console.log(invitations);
  return (
    <div>
      <Cards onEnd={() => console.log("end")} className="h-screen w-full">
        {users.map((user) => (
          <Card
            key={user.id}
            onSwipeLeft={() => console.log("swipe left")}
            onSwipeRight={() => sendInvitation(user.id)}
            className="h-full w-full rounded-xl shadow-lg"
          >
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
              <div className="flex cursor-grab flex-col overflow-hidden rounded-xl border bg-background shadow-lg">
                {/** Profile image */}
                <div className="flex items-center justify-center overflow-hidden rounded-t-xl">
                  {user.image && (
                    <Image
                      src={user.image!}
                      alt={user.name!}
                      quality={100}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {!user.image && (
                    <div className="flex h-full w-full overflow-hidden rounded-t-xl">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        alt="Placeholder"
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 rounded-b-xl">
                  <div className="flex flex-col space-y-2 p-4">
                    <p className="text-2xl font-bold text-foreground">
                      {user.name},{" "}
                      <span className="font-medium text-muted-foreground">
                        20
                      </span>
                    </p>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <BriefcaseIcon size={16} />
                        <span>
                          {user.occupation || "No occupation available"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPinIcon size={16} />
                        <span>{user.location || "No location available"}</span>
                      </div>
                    </div>
                  </div>
                  <Separator className="w-full" />
                  <p className="max-h-24 overflow-hidden overflow-ellipsis p-4 text-muted-foreground">
                    {user.bio || "No bio available"}
                  </p>

                  <div className="flex items-center justify-center space-x-4 pb-6">
                    <Button
                      className="h-16 w-16 rounded-full shadow-xl"
                      variant={"outline"}
                    >
                      <XIcon
                        strokeWidth={3}
                        size={32}
                        className="text-destructive"
                      />
                    </Button>
                    <Button
                      className="h-16 w-16 rounded-full shadow-xl"
                      variant={"outline"}
                    >
                      <AiFillHeart size={32} className="text-green-500" />
                    </Button>
                    <Button
                      className="h-16 w-16 rounded-full shadow-xl"
                      variant={"outline"}
                    >
                      <IoIosWarning size={32} className="text-yellow-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </Cards>
    </div>
  );
}
