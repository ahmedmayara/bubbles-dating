"use client";

import { Form, FormControl, FormField } from "./ui/form";

import {
  CreateMessageSchemaType,
  createMessageSchema,
} from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircleIcon, SendIcon, SmileIcon } from "lucide-react";
import { createMessage } from "@/actions/actions";
import { EmojiPicker } from "./emoji-picker";
import { useToast } from "./ui/use-toast";

interface ConversationFormProps {
  conversationId: string;
  status: string;
  meOrnot: boolean;
}

export function ConversationForm({
  conversationId,
  status,
  meOrnot,
}: ConversationFormProps) {
  const createMessageForm = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: CreateMessageSchemaType) {
    await createMessage(conversationId, data.message);
    createMessageForm.reset({ message: "" });
  }
  return (
    <div className="mb-14 border-t bg-white px-4 py-4 lg:mb-0">
      <Form {...createMessageForm}>
        <form
          onSubmit={createMessageForm.handleSubmit(onSubmit)}
          className="flex w-full items-center gap-2 lg:gap-4"
        >
          {status === "BLOCKED" && meOrnot ? (
            <div className="flex w-full items-center justify-center gap-2">
              <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              <h1 className="text-sm font-semibold text-muted-foreground">
                You cannot send messages to this user.
              </h1>
            </div>
          ) : status === "BLOCKED" && !meOrnot ? (
            <div className="flex w-full items-center justify-center gap-2">
              <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              <h1 className="text-sm font-semibold text-muted-foreground">
                You cannot send messages to this user.
              </h1>
            </div>
          ) : (
            <>
              <FormField
                control={createMessageForm.control}
                name="message"
                render={({ field }) => (
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        placeholder="Type a message"
                        autoComplete="off"
                      />
                    </div>
                  </FormControl>
                )}
              />

              <Button
                size={"icon"}
                type="submit"
                disabled={createMessageForm.formState.isSubmitting}
              >
                <SendIcon className="h-4 w-4" />
              </Button>

              <EmojiPicker
                onChange={(emoji) => {
                  createMessageForm.setValue(
                    "message",
                    createMessageForm.getValues("message") + emoji,
                  );
                }}
              />
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
