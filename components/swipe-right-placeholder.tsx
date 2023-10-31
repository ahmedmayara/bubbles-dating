import React from "react";
import { AiFillHeart } from "react-icons/ai";

export function SwipeRightPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-foreground/30 p-6">
      <AiFillHeart className="h-32 w-32 text-green-500" />
    </div>
  );
}
