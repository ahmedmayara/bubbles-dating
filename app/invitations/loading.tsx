import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="h-screen bg-secondary lg:ml-80">
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner size="xl" />
      </div>
    </div>
  );
}
