import { getReportsById } from "@/actions/actions";
import { ReportsClient } from "@/components/reports-client";
import React from "react";

interface UserDetailsProps {
  params: {
    userId: string;
  };
}

export default async function UserDetails({ params }: UserDetailsProps) {
  const reports = await getReportsById(params.userId);
  return <ReportsClient reports={reports} />;
}
