"use client";

import React from "react";
import {FcGoogle} from "react-icons/fc";
import {signIn} from "next-auth/react";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";

export const Social = () => {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full">
      <button
        onClick={() => onClick("google")}
        className="w-full flex justify-center items-center bg-slate-100 rounded-md"
      >
        <FcGoogle className="w-[40px] h-[40px]" />
      </button>
    </div>
  );
};
