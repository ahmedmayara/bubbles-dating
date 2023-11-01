import { getAllInvitations, getAllUsers } from "@/actions/actions";
import { SwipeLeftPlaceholder } from "@/components/swipe-left-placeholder";
import { SwipeRightPlaceholder } from "@/components/swipe-right-placeholder";
import { UserCard } from "@/components/user-card";

export default async function App() {
  const users = await getAllUsers();
  const invitations = await getAllInvitations();
  return (
    <div className="h-screen bg-secondary lg:ml-80">
      <div className="grid h-screen grid-cols-1 place-content-center gap-4 lg:grid-cols-3">
        <SwipeLeftPlaceholder />
        {/* @ts-ignore */}
        <UserCard users={users} invitations={invitations} />
        <SwipeRightPlaceholder />
      </div>
    </div>
  );
}
