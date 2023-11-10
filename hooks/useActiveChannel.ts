import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";
import React from "react";
import { pusherClient } from "@/lib/pusher";

export default function useActiveChannel() {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = React.useState<Channel | null>(
    null,
  );

  React.useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-bubbles");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialsMembers: string[] = [];

      members.each((member: Record<string, any>) => {
        initialsMembers.push(member.id);
        set(initialsMembers);
      });

      channel?.bind("pusher:member_added", (member: Record<string, any>) => {
        add(member.id);
      });

      channel?.bind("pusher:member_removed", (member: Record<string, any>) => {
        remove(member.id);
      });

      return () => {
        if (activeChannel) {
          pusherClient.unsubscribe("presence-bubbles");
          setActiveChannel(null);
        }
      };
    });
  }, [activeChannel, add, remove, set]);
}
