"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoIosWarning } from "react-icons/io";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportUserSchemaType, reportUserSchema } from "@/schemas/schemas";
import { reportUser } from "@/actions/actions";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import { Spinner } from "./spinner";

interface ReportUserButtonProps {
  id: string;
}

export function ReportUserButton({ id }: ReportUserButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const reportUserForm = useForm<ReportUserSchemaType>({
    resolver: zodResolver(reportUserSchema),
  });

  async function onSubmit(data: ReportUserSchemaType) {
    try {
      setIsLoading(true);
      await reportUser(id, data)
        .then(() => {
          setIsLoading(false);
          reportUserForm.reset();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-16 w-16 rounded-full shadow-xl"
          variant={"outline"}
        >
          <IoIosWarning size={32} className="text-yellow-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report user</DialogTitle>
          <DialogDescription>
            Are you sure you want to report this user?
          </DialogDescription>
        </DialogHeader>

        <Form {...reportUserForm}>
          <form onSubmit={reportUserForm.handleSubmit(onSubmit)}>
            <FormField
              control={reportUserForm.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Reason"
                      className="w-full"
                      rows={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              reportUserForm.reset();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              reportUserForm.handleSubmit(onSubmit)();
            }}
          >
            {isLoading ? <Spinner size="sm" /> : "Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
