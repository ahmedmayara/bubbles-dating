import { ConversationBody } from "@/components/conversation-body";
import { ConversationForm } from "@/components/conversation-form";
import { ConversationHeader } from "@/components/conversation-header";

interface PageProps {
  params: {
    conversationId: string;
  };
}

export default async function Page({ params }: PageProps) {
  return (
    <div className="h-screen bg-secondary lg:ml-80">
      <div className="flex h-full flex-col">
        <ConversationHeader conversationId={params.conversationId} />
        <ConversationBody conversationId={params.conversationId} />
        <ConversationForm conversationId={params.conversationId} />
      </div>
    </div>
  );
}
