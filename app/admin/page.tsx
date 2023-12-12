export const dynamic = "force-dynamic";

import { GetAllUsersFilters, getAllUsers } from "@/actions/actions";
import { columns } from "@/components/data-table/columns";
import { UsersDataTable } from "@/components/data-table/users-data-table";

interface AppProps {
  searchParams: GetAllUsersFilters;
}

export default async function Admin({ searchParams }: AppProps) {
  const users = await getAllUsers(searchParams);
  return (
    <>
      <div className="flex items-center justify-between space-y-2 pb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the users in your database.
          </p>
        </div>
      </div>
      {/* @ts-ignore */}
      <UsersDataTable columns={columns} data={users} />
    </>
  );
}
