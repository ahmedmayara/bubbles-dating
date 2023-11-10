import React from "react";
import { AiFillHeart } from "react-icons/ai";

export function SwipeRightPlaceholder() {
  return (
    <div className="hidden h-full w-full items-center justify-center rounded-xl p-6 lg:flex">
      <AiFillHeart className="h-32 w-32 text-green-500" />
    </div>
  );
}
