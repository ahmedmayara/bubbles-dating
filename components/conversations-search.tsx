"use client";

import React from "react";

import { getAllConversations } from "@/actions/actions";
import { SearchIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ConversationsSearchProps {
  conversations: Awaited<ReturnType<typeof getAllConversations>>;
  currentUser: User;
}

export function ConversationsSearch({
  conversations,
  currentUser,
}: ConversationsSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const onSelect = (id: string) => {
    router.push(`/app/conversations/${id}`);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group mb-4 flex w-full items-center gap-x-2 rounded-full border bg-muted px-3 py-2 transition-colors duration-200 hover:bg-accent focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <SearchIcon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
        <p className="text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
          Search
        </p>
        <kbd className="text+bg-muted-foreground pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">⌘</span> <span className="text-xs">K</span>
        </kbd>
      </button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search conversations" />
        <CommandList>
          <CommandEmpty>No conversations found.</CommandEmpty>
          <CommandGroup heading="Conversations">
            {conversations.map((conversation) => (
              <CommandItem
                key={conversation.id}
                onSelect={() => onSelect(conversation.id)}
              >
                {conversation.participants.map((user) => {
                  if (user.id !== currentUser.id) {
                    return user.name;
                  }
                })}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
