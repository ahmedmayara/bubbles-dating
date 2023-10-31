import getCurrentUser from "@/actions/actions";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileFooter } from "./mobile-footer";

export async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      {/* @ts-ignore */}
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="h-full lg:pl-20">{children}</main>
    </div>
  );
}

export default Sidebar;
