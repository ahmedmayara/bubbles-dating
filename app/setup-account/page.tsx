import React from "react";
import { SetUpAccountForm } from "./_components/form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="py-20">
      <div className="flex items-center justify-center">
        <Image
          alt="Logo"
          height="50"
          width="50"
          src="/logo.svg"
          className="mx-auto h-[4.5rem] w-auto"
          priority
        />
      </div>
      <SetUpAccountForm />
    </div>
  );
}
