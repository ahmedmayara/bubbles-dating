import getCurrentUser, { getAllConversations } from "@/actions/actions";
import { ConversationsSearch } from "./conversations-search";
import { Separator } from "./ui/separator";
import { MobileConversationsListItem } from "./mobile-conversation-item";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserButton } from "./user-button";
import { AvatarButton } from "./avatar-button";

interface MobileConversationsListProps {
  conversations: Awaited<ReturnType<typeof getAllConversations>>;
}

export async function MobileConversationsList({
  conversations,
}: MobileConversationsListProps) {
  const currentUser = await getCurrentUser();
  return (
    <div className="flex h-full flex-col gap-2 bg-secondary p-8 lg:hidden">
      <div className="flex flex-col items-start justify-start gap-1.5">
        <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
        <span className="text-muted-foreground">
          Select a conversation to start chatting.
        </span>
      </div>

      <div className="pt-1.5">
        <ConversationsSearch
          className="mb-0 bg-background hover:bg-background focus:bg-background"
          conversations={conversations}
          currentUser={currentUser}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex w-max space-x-6 py-4">
          {conversations.map((conversation) => (
            <>
              {conversation.participants.map((user) => {
                if (user.id !== currentUser.id) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <AvatarButton key={user.id} user={user} />
                      <p className="text-sm text-foreground">
                        {user.name?.split(" ")[0]}
                      </p>
                    </div>
                  );
                }
              })}
            </>
          ))}
        </div>
      </div>

      <Separator className="mb-2" />
      {Array.isArray(conversations) &&
        conversations.map((conversation) => (
          <MobileConversationsListItem
            key={conversation.id}
            conversation={conversation}
            currentUser={currentUser}
          />
        ))}
    </div>
  );
}