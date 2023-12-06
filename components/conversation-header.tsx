import getCurrentUser, { getConversation } from "@/actions/actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DeleteConversationDialog } from "./delete-conversation-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { format } from "date-fns";
import { BlockUserButton } from "./block-user-button";
import { DeblockUserButton } from "./deblock-user-button";

interface ConversationHeaderProps {
  conversationId: string;
  status: string;
  meOrnot: boolean;
}

export async function ConversationHeader({
  conversationId,
  status,
  meOrnot,
}: ConversationHeaderProps) {
  const conversation = await getConversation(conversationId);
  const currentUser = await getCurrentUser();
  const user = conversation?.participants.find(
    (participant) => participant.id !== currentUser.id,
  );
  return (
    <div className="flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/app/conversations"
          className="block cursor-pointer text-primary transition lg:hidden"
        >
          <ChevronLeft size={25} />
        </Link>
        <Avatar>
          <AvatarImage src={user?.image!} alt={user?.name!} />
          <AvatarFallback>
            <span>{user?.name![0]}</span>
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div>
            <span className="font-semibold text-foreground">{user?.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <span>
              Joined on{" "}
              {format(new Date(user?.createdAt!), "MMMM dd, yyyy").toString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DeleteConversationDialog conversationId={conversationId} />
        {status === "active" && (
          <BlockUserButton id={user?.id!} idofconv={conversationId} />
        )}
        {status === "BLOCKED" && meOrnot && (
          <DeblockUserButton id={user?.id!} idofconv={conversationId} />
        )}
      </div>
    </div>
  );
}
