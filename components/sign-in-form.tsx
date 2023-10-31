"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchemaType, signInSchema } from "@/schemas/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { AiOutlineGoogle } from "react-icons/ai";

export function SignInForm() {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: SignInSchemaType) {
    try {
      signIn("credentials", {
        ...values,
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          alert("error");
        }
        if (callback?.ok && !callback?.error) {
          alert("success");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Please enter your credentials to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? (
              <span>Continue</span>
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </CardFooter>

        <div className="px-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="my-6">
            <Button
              variant={"outline"}
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              <AiOutlineGoogle className="h-4 w-4" />
              <span className="ml-2">Google</span>
            </Button>
            <div className="mt-4">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href={"/sign-in"}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
