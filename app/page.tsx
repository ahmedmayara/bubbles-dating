import { AuthForm } from "@/components/auth-form";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height="50"
          width="50"
          src="/logo.svg"
          className="mx-auto h-[4.5rem] w-auto"
        />
        <AuthForm />
      </div>
    </div>
  );
}
