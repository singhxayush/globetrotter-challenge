"use client";

import React from "react";
import {Button} from "../ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({href, label}: BackButtonProps) => {
  return (
    <Button variant={"link"} size={"sm"} asChild className="font-normal w-full text-indigo-500 hover:text-indigo-700 underline underline-offset-2">
      <Link href={href}>{label}</Link>
    </Button>
  );
};
