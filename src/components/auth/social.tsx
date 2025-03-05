"use client";

import React from "react";
import {Button} from "../ui/button";
import {FcGoogle} from "react-icons/fc";
import {signIn} from "next-auth/react";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {Github} from "lucide-react";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-1">
      <Button
        onClick={() => onClick("google")}
        size={"lg"}
        variant={"outline"}
        className="w-full"
      >
        Google
        <FcGoogle size={24} className="text-2xl" />
      </Button>
      <Button
        onClick={() => onClick("github")}
        size={"lg"}
        variant={"outline"}
        className="w-full"
      >
        GitHub
        <Github className="w-20 h-20" />
      </Button>
    </div>
  );
};
