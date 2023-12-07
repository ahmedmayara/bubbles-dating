"use client";

import * as React from "react";

enum FormVariant {
  SIGN_UP,
  SIGN_IN,
}

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
import {
  SignInSchemaType,
  SignUpSchemaType,
  signInSchema,
  signUpSchema,
} from "@/schemas/schemas";
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
import { TbBrandGoogle } from "react-icons/tb";
import { signUp } from "@/actions/actions";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export function AuthForm() {
  const { toast } = useToast();
  const [formVariant, setFormVariant] = React.useState<FormVariant>(
    FormVariant.SIGN_IN,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const router = useRouter();
  const { setEmail, setName, setPassword } = useUser();

  React.useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/app");
    }
  }, [session, router]);

  const toggleFormVariant = React.useCallback(() => {
    if (formVariant === FormVariant.SIGN_IN) {
      setFormVariant(FormVariant.SIGN_UP);
    } else {
      setFormVariant(FormVariant.SIGN_IN);
    }
  }, [formVariant]);

  const signUpForm = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const signInForm = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  async function signUpOnSubmit(values: SignUpSchemaType) {
    try {
      await signUp(values).then(() => {
        setName(values.name);
        setEmail(values.email);
        setPassword(values.password);
        router.push("/setup-account");
      });
      toast({
        title: "Success",
        description: "Signed up successfully",
        variant: "success",
      });
      signUpForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  async function signInOnSubmit(values: SignInSchemaType) {
    try {
      setIsLoading(true);
      signIn("credentials", {
        ...values,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast({
              title: "Error",
              description: "Invalid credentials",
              variant: "destructive",
            });
          }
          if (callback?.ok && !callback?.error) {
            toast({
              title: "Success",
              description: "Signed in successfully",
              variant: "success",
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  const socialAction = (provider: string) => {
    setIsLoading(true);
    signIn(provider, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        }
        if (callback?.ok && !callback?.error) {
          toast({
            title: "Success",
            description: "Signed in successfully",
            variant: "success",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>
            {formVariant === FormVariant.SIGN_IN ? "Sign In" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            Please enter your credentials to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formVariant === FormVariant.SIGN_UP && (
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(signUpOnSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
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
                  control={signUpForm.control}
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
                <FormField
                  control={signUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Confirmation</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          {formVariant === FormVariant.SIGN_IN && (
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(signInOnSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={
                            signInForm.formState.errors.email
                              ? "ring-2 ring-destructive"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className={
                            signInForm.formState.errors.password
                              ? "ring-2 ring-destructive"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={
              formVariant === FormVariant.SIGN_IN
                ? signInForm.handleSubmit(signInOnSubmit)
                : signUpForm.handleSubmit(signUpOnSubmit)
            }
            className="w-full"
            disabled={
              signInForm.formState.isSubmitting ||
              signUpForm.formState.isSubmitting ||
              isLoading
            }
          >
            {formVariant === FormVariant.SIGN_IN ? (
              signInForm.formState.isSubmitting ||
              signUpForm.formState.isSubmitting ||
              isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )
            ) : signUpForm.formState.isSubmitting ||
              signInForm.formState.isSubmitting ||
              isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continue"
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
              disabled={
                signInForm.formState.isSubmitting ||
                signUpForm.formState.isSubmitting ||
                isLoading
              }
              onClick={() => socialAction("google")}
            >
              <TbBrandGoogle className="h-4 w-4" />
              <span className="ml-2">Google</span>
            </Button>

            <div className="mt-4">
              <p className="text-center text-sm text-muted-foreground">
                {formVariant === FormVariant.SIGN_IN
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button
                  variant={"link"}
                  onClick={toggleFormVariant}
                  className="px-1"
                >
                  {formVariant === FormVariant.SIGN_IN ? "Sign Up" : "Sign In"}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
