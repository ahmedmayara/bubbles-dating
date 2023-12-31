"use client";

import React from "react";
import qs from "query-string";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontalIcon } from "lucide-react";
import { GENDERS } from "@/schemas/schemas";
import { Separator } from "./ui/separator";
import { CountrySelect } from "@/app/setup-account/_components/country-select";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export interface CountrySelectValue {
  value: string;
  label: string;
  flag: string;
  latlang: number[];
  region: string;
}

export function FilterDialog() {
  const router = useRouter();
  const params = useSearchParams();

  const [open, setOpen] = React.useState(false);
  const [selectedGender, setSelectedGender] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState<
    CountrySelectValue | undefined
  >(undefined);

  const onSubmit = React.useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      gender: selectedGender,
      location: selectedLocation?.label,
    };

    const url = qs.stringifyUrl(
      {
        url: "/app",
        query: updatedQuery,
      },
      { skipNull: true },
    );

    setOpen(false);

    router.push(url);
  }, [params, router, selectedGender, selectedLocation, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "group flex cursor-pointer gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-muted-foreground transition duration-150 ease-in-out hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground focus:outline-none",
          )}
        >
          <SlidersHorizontalIcon
            className="h-6 w-6 shrink-0"
            aria-hidden="true"
          />
          <span className="sr-only">Filters</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Use filters to narrow down your search results.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Gender</h1>
            <p className="text-sm text-muted-foreground">
              Select one or more options.
            </p>
          </div>

          <div className="mt-4 flex flex-row items-center justify-between">
            <div
              onClick={() => setSelectedGender(GENDERS.Male)}
              className={cn(
                "hover:bg-accentflex-row flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-l-xl border p-3 transition-colors hover:bg-muted",
                selectedGender === GENDERS.Male &&
                  "border-none bg-primary text-white hover:bg-primary",
              )}
            >
              Male
            </div>
            <div
              onClick={() => setSelectedGender(GENDERS.Female)}
              className={cn(
                "hover:bg-accentflex-row flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-r-xl border border-l-0 p-3 transition-colors hover:bg-muted",
                selectedGender === GENDERS.Female &&
                  "border-none bg-primary text-white hover:bg-primary",
              )}
            >
              Female
            </div>
          </div>
        </div>

        <Separator />

        <Separator />

        <div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Location</h1>
            <p className="text-sm text-muted-foreground">
              Select a location to search in.
            </p>
          </div>

          <div className="mt-4">
            <CountrySelect
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-row-reverse">
          <Button onClick={onSubmit} className="w-full">
            Apply
          </Button>

          {params && (
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setSelectedGender("");
                setSelectedLocation(undefined);
                router.push("/app");
              }}
              className="mr-2 w-full"
            >
              Reset filters
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
