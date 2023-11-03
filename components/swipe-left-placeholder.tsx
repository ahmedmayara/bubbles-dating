import { XCircleIcon } from "lucide-react";
import React from "react";

export function SwipeLeftPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl p-6">
      <XCircleIcon className="h-32 w-32 text-destructive" />
    </div>
  );
}
