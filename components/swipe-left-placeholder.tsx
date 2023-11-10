import { XCircleIcon } from "lucide-react";
import React from "react";

export function SwipeLeftPlaceholder() {
  return (
    <div className=" hidden h-full w-full items-center justify-center rounded-xl p-6 lg:flex">
      <XCircleIcon className="h-32 w-32 text-destructive" />
    </div>
  );
}
