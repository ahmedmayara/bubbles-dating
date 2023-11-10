"use client";

import useActiveChannel from "@/hooks/useActiveChannel";

export function ActiveStatus() {
  useActiveChannel();

  return null;
}
