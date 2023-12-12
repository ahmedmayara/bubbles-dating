"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { DataTableColumnHeader } from "./data-table-column-header";
import { UsersTableActions } from "../users-table-actions";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "birthdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Birthdate" />
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      return <>{user.birthdate?.toLocaleDateString()}</>;
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      return (
        <>
          {user.status === "ACTIVE" ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="destructive">Disabled</Badge>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "totalBlocks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Blocks" />
    ),
  },
  {
    accessorKey: "totalReports",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Reports" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      return <>{user.createdAt.toLocaleDateString()}</>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <UsersTableActions row={row} />,
  },
];
