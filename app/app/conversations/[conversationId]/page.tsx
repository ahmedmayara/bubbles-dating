import getCurrentUser, {
  getConversation,
  getMessages,
} from "@/actions/actions";
import { ConversationBody } from "@/components/conversation-body";
import { ConversationForm } from "@/components/conversation-form";
import { ConversationHeader } from "@/components/conversation-header";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

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
    <Suspense fallback={<LoadingState />}>
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
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="h-screen bg-secondary lg:ml-80">
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2Icon className="h-16 w-16 animate-spin" />
      </div>
    </div>
  );
}
