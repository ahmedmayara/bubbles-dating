"use client";

import { getReportsById } from "@/actions/actions";
import React from "react";
import { AvatarButton } from "./avatar-button";
import { GhostIcon } from "lucide-react";

interface ReportsClientProps {
  reports: Awaited<ReturnType<typeof getReportsById>>;
}

export function ReportsClient({ reports }: ReportsClientProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
      {Array.isArray(reports) && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 pt-8">
          <GhostIcon className="h-24 w-24 text-muted-foreground" />
          <p className="text-xl font-semibold leading-6 text-muted-foreground">
            No reports
          </p>
        </div>
      )}
      <ul role="list" className="divide-y divide-muted pt-8">
        {Array.isArray(reports) &&
          reports.map((report) => (
            <li key={report.id} className="py-4">
              <div className="flex min-w-0 gap-x-4">
                <AvatarButton user={report.reporter} />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-foreground">
                    {report.reporter.name}
                  </p>
                  <p className="mt-1 truncate text-sm leading-5 text-muted-foreground">
                    {report.reporter.email}
                  </p>
                  <p className="mt-1 truncate text-sm leading-5 text-muted-foreground">
                    Reason of report: {report.reason}
                  </p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
