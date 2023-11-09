"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";

import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  endpoint: "profileImage";
  value: string;
  onValueChange: (value: string) => void;
}

export function ImageUpload({
  endpoint,
  value,
  onValueChange,
}: ImageUploadProps) {
  const fileType = value?.split(".").pop();

  if (value && fileType && ["jpg", "jpeg", "png"].includes(fileType)) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 pt-12">
        <div className="relative h-32 w-32">
          <Image
            fill
            src={value}
            alt="Profile Image"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          />
          <button
            onClick={() => {
              onValueChange("");
            }}
            className="absolute right-0 top-0 rounded-full bg-primary p-1 text-white shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onValueChange(res?.[0].url!);
      }}
      onUploadError={(err) => {
        console.error(err);
      }}
    ></UploadDropzone>
  );
}
