import { createUploadthing, type FileRouter } from "uploadthing/next";
import getCurrentUser from "@/actions/actions";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
