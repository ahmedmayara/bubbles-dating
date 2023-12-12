"use client";

import React from "react";
import Image from "next/image";
import { Container } from "./container";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export function AdminNavbar() {
  return (
    <div className="fixed z-10 w-full bg-background">
      <div className="border-b py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-4 md:gap-0">
            <Image
              alt="Logo"
              height="50"
              width="50"
              src="/logo.svg"
              className="h-[2rem] w-auto"
            />
            <div className="flex flex-row items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                Sign out
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
