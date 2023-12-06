export const dynamic = "force-dynamic";

import { getAllConversations } from "@/actions/actions";
import { MobileConversationsList } from "@/components/mobile-conversations-list";
import { MessageCircleIcon } from "lucide-react";

export default async function Page() {
  const conversations = await getAllConversations();
  return (
    <>
      <div className="hidden h-full flex-col items-center justify-center gap-2 bg-secondary lg:ml-80 lg:flex">
        <MessageCircleIcon className="h-20 w-20 text-muted-foreground" />
        <div className="text-2xl font-bold text-foreground">
          Select a conversation
        </div>
        <div className="text-center text-sm text-muted-foreground">
          You can start a new conversation by clicking on the preferred contact
          on the left sidebar.
        </div>
      </div>
      <MobileConversationsList conversations={conversations} />
    </>
  );
}
