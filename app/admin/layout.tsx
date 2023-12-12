import React from "react";

import { AdminNavbar } from "@/components/admin-navbar";
import { Container } from "@/components/container";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <AdminNavbar />

      <div className="pt-24">
        <Container>{children}</Container>
      </div>
    </>
  );
}
