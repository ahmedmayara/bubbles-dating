"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { ShieldBan } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { blockUser } from "@/actions/actions";

interface BlockUserButtonProps {
  id: string;
  idofconv: string;
}

export function BlockUserButton({ id, idofconv }: BlockUserButtonProps) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <ShieldBan className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to blocke your freind , you will not be able
            to send him messages
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              blockUser(id).then(() => {
                router.push(`/app/conversations/${idofconv}`);
              })
            }
            className={buttonVariants({ variant: "destructive" })}
          >
            Block
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
