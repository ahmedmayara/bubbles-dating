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
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { deblockUser } from "@/actions/actions";

interface DeblockUserButtonProps {
  id: string;
  idofconv: string;
}

export function DeblockUserButton({ id, idofconv }: DeblockUserButtonProps) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size={"icon"}
          style={{ backgroundColor: "green" }}
        >
          <ShieldCheck className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>you will bloke your freind </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to blocke your freind , you will not be able
            to send him messages
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deblockUser(id).then(() => {
                router.push(`/app/conversations/${idofconv}`);
              })
            }
            className={buttonVariants({ variant: "success" })}
          >
            debloker
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
