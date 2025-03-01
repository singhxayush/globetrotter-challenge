import {Social} from "@/components/auth/social";
import React from "react";

const LoginPage = () => {
  return (
    <div className="w-fullh-full flex items-center justify-cente">
      <div className="bg-neutral-900/70 h-[50%] w-[300px] flex flex-col items-center justify-evenly p-6 rounded-xl gap-10">
        <h1 className="text-6xl text-zinc-300 font-extrabold">
          LOGIN WITH GOOGLE
        </h1>
        <Social />
      </div>
    </div>
  );
};

export default LoginPage;
