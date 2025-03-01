"use client";

import React from "react";
import {useRouter} from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
}: // asChild,
LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log("LOGIN BUTTON CLICKED");
    router.push("/auth/login");
  };

  if (mode == "modal") {
    return <span>TODO - Implement Modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
