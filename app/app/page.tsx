import { getAllUsers } from "@/actions/actions";
import { SwipeLeftPlaceholder } from "@/components/swipe-left-placeholder";
import { SwipeRightPlaceholder } from "@/components/swipe-right-placeholder";
import { UserCard } from "@/components/user-card";

export default async function App() {
  const users = await getAllUsers();
  return (
    <div className="bg-secondary lg:ml-80">
      <div className="grid grid-cols-1 place-content-center gap-4 lg:grid-cols-3">
        <SwipeLeftPlaceholder />
        {/* @ts-ignore */}
        <UserCard users={users} />
        <SwipeRightPlaceholder />
      </div>
    </div>
  );
}
