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
import { SendIcon, SmileIcon } from "lucide-react";
import { createMessage } from "@/actions/actions";
import { EmojiPicker } from "./emoji-picker";

interface ConversationFormProps {
  conversationId: string;
}

export function ConversationForm({ conversationId }: ConversationFormProps) {
  const createMessageForm = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      message: "",
    },
  });

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

          <div className="flex items-center gap-2">
            <EmojiPicker
              onChange={(emoji: string) =>
                createMessageForm.setValue(
                  "message",
                  createMessageForm.watch("message") + emoji,
                )
              }
            />
            <Button
              size={"icon"}
              type="submit"
              disabled={
                createMessageForm.formState.isSubmitting ||
                createMessageForm.watch("message") === ""
              }
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
