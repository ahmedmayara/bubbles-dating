import getCurrentUser, {
  getConversation,
  getMessages,
} from "@/actions/actions";
import { ConversationBody } from "@/components/conversation-body";
import { ConversationForm } from "@/components/conversation-form";
import { ConversationHeader } from "@/components/conversation-header";

interface PageProps {
  params: {
    conversationId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const conversation = await getConversation(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const currentUser = await getCurrentUser();
  return (
    <div className="h-screen bg-secondary lg:ml-80">
      <div className="flex h-full flex-col">
        <ConversationHeader conversationId={params.conversationId} />
        <ConversationBody
          conversation={conversation}
          initialMessages={messages}
          currentUser={currentUser}
        />
        <ConversationForm conversationId={params.conversationId} />
      </div>
    </div>
  );
}
