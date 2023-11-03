import React from "react";

import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen bg-secondary lg:ml-80">
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2Icon className="h-16 w-16 animate-spin" />
      </div>
    </div>
  );
}
