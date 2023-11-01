import getCurrentUser, { getAllConversations } from "@/actions/actions";
import { ConversationsListItem } from "./conversation-list-item";

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
          <div className="py-4 text-2xl font-bold text-foreground">
            Conversations
          </div>
        </div>
        {Array.isArray(conversations) &&
          conversations.map((conversation) => (
            <ConversationsListItem
              key={conversation.id}
              data={conversation}
              currentUser={currentUser}
            />
          ))}
      </div>
    </aside>
  );
}
