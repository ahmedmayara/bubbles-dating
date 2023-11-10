"use client";

import { SmileIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ onChange }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={"icon"}
          type="button"
          variant={"ghost"}
          className="data-[state=open]:bg-accent"
        >
          <SmileIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={300}
        className="mb-[125px] border-none bg-transparent shadow-none drop-shadow-none lg:mb-16"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          theme="light"
          previewPosition="none"
        />
      </PopoverContent>
    </Popover>
  );
}
