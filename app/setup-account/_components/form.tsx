"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";

import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelect } from "./country-select";
import dynamic from "next/dynamic";
import { SetupAccountSchemaType, setupAccountSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "./image-upload";
import { CheckIcon } from "lucide-react";
import { setUpAccount } from "@/actions/actions";
import { signIn } from "next-auth/react";

const steps = [
  {
    id: "Step 1",
    name: "Fundamental Details",
    fields: ["name", "birthdate", "email", "occupation", "bio"],
  },
  {
    id: "Step 2",
    name: "Geographic Coordinates",
    fields: ["country", "city"],
  },
  {
    id: "Step 3",
    name: "Personal Picture",
    fields: ["image"],
  },
  {
    id: "Step 4",
    name: "Complete",
  },
];

export function SetUpAccountForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [previousStep, setPreviousStep] = React.useState(0);
  const delta = currentStep - previousStep;
  const { name, email, password } = useUser();

  const setUpAccountForm = useForm<SetupAccountSchemaType>({
    resolver: zodResolver(setupAccountSchema),
    defaultValues: {
      name,
      email,
    },
  });

  const setCustomValue = (id: keyof SetupAccountSchemaType, value: any) => {
    setUpAccountForm.setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const processForm = async (data: SetupAccountSchemaType) => {
    await setUpAccount(data).then(() => {
      signIn("credentials", {
        email,
        password,
        callbackUrl: "/app",
      });
    });
  };

  type FieldName = keyof SetupAccountSchemaType;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await setUpAccountForm.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await setUpAccountForm.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const country = setUpAccountForm.watch("country");

  const Map = useMemo(
    () =>
      dynamic(() => import("./map").then((mod) => mod.Map), {
        ssr: false,
      }),
    [country],
  );
  return (
    <section className="absolute inset-0 flex flex-col justify-between p-56">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-muted-foreground transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-muted-foreground transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <Form {...setUpAccountForm}>
        <form
          className="py-12"
          onSubmit={setUpAccountForm.handleSubmit(processForm)}
        >
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-foreground">
                Fundamental Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Provide your personal details in order to complete your account
                setup.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <FormField
                    control={setUpAccountForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-2 sm:col-span-3">
                  <FormField
                    control={setUpAccountForm.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Birthdate</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="birthdate"
                                variant={"outline"}
                                className={cn(
                                  "text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  <span>
                                    {format(
                                      new Date(field.value),
                                      "dd MMMM yyyy",
                                    )}
                                  </span>
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) =>
                                  setCustomValue("birthdate", date)
                                }
                                defaultMonth={new Date("2000-01-01")}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={setUpAccountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <FormField
                    control={setUpAccountForm.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-6">
                  <FormField
                    control={setUpAccountForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}
          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-foreground">
                Geographic Coordinates
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Provide your geographic coordinates in order to complete your
                account setup.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <FormField
                    control={setUpAccountForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <CountrySelect
                            value={field.value}
                            onValueChange={(value) =>
                              setCustomValue("country", value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-3">
                  <FormField
                    control={setUpAccountForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-6">
                  <Map center={country?.latlang} />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-foreground">
                Personal Picture
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Provide your personal picture in order to complete your account
                setup.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <FormField
                    control={setUpAccountForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            endpoint="profileImage"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center justify-center">
                <CheckIcon className="h-16 w-16 text-green-600" />
                <h2 className="text-base font-semibold leading-7 text-foreground">
                  Account Setup Complete
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  You can now use your account.
                </p>
                <span className="mt-4 text-sm leading-6 text-muted-foreground">
                  Redirecting...
                </span>
              </div>
            </motion.div>
          )}
        </form>
      </Form>

      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <Button
            variant={"outline"}
            onClick={previous}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            variant={"outline"}
            onClick={next}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </section>
  );
}
