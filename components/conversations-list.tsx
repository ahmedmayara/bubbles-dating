import getCurrentUser, { getAllConversations } from "@/actions/actions";
import { ConversationsListItem } from "./conversation-list-item";
import { ConversationsSearch } from "./conversations-search";
import { GhostIcon } from "lucide-react";

interface ConversationsListProps {
  conversations: Awaited<ReturnType<typeof getAllConversations>>;
}

export async function ConversationsList({
  conversations,
}: ConversationsListProps) {
  const currentUser = await getCurrentUser();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-full overflow-y-auto border-r pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="gap-2 py-4 text-foreground">
            <p className="text-2xl font-bold">Conversations</p>
            <p className="text-sm text-muted-foreground">
              Talk to the people you matched with!
            </p>
          </div>

          <ConversationsSearch
            conversations={conversations}
            currentUser={currentUser}
          />
        </div>
        {Array.isArray(conversations) &&
          conversations.map((conversation) => (
            <ConversationsListItem
              key={conversation.id}
              data={conversation}
              currentUser={currentUser}
            />
          ))}

        {conversations.length === 0 && (
          <div className="mt-4 flex flex-col items-center justify-center gap-2">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted p-4">
              <GhostIcon className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                No conversations found
              </p>
              <span className="text-xs text-muted-foreground">
                Start a conversation with someone!
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
