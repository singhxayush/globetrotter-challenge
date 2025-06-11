"use client";

import {cn} from "@/lib/utils";
import {Roboto} from "next/font/google";
import Image from "next/image";
import React from "react";
import {NavDropdown} from "./NarDropdown";
// import {Link, LogIn} from "lucide-react";
// import {Button} from "./ui/button";
import {Session} from "next-auth";
import {usePathname} from "next/navigation";

const fontRoboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["500", "100", "300", "400"],
});

type NavBarProps = {
  session: Session | null;
  handleSignOut: () => Promise<void>;
};

const NavBar = ({session, handleSignOut}: NavBarProps) => {
  const pathname = usePathname();

  // Check specific conditions for hiding the navbar
  const shouldHideNavbar =
    pathname === "/game" || // Exact match for /game
    pathname.match("/game/multiplayer/"); // Any path that extends beyond /game/multiplayer

  // If navbar should be hidden, return null
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[2000] w-full h-20 flex justify-between 
          items-center bg-white shadow-md shadow-black/5 px-4 py-2
          motion-translate-y-in-[-200%] motion-ease motion-duration-500 border-b-[0.1pt]"
    >
      {/* Left - LOGO + NAME */}
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={0}
          height={0}
          className="rounded-full w-12 h-12 bg-zinc-100"
        />
        <h1
          className={cn(
            "text-neutral-600 text-xl font-normal sm:block hidden",
            fontRoboto.className
          )}
        >
          Globetrotter
        </h1>
      </div>

      {/* Right - DROPDOWN */}
      <div className="mr-0 sm:mr-2">
        <NavDropdown handleSignOut={handleSignOut} session={session} />
      </div>
    </nav>
  );
};

export default NavBar;

{
  /* <Button
className="motion-preset-focus-lg motion-duration-2000 group-hover text-neutral-950 bg-white-500 border-[0.11pt] border-black/20
    rounded-lg px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 hover:shadow-none
    active:shadow-none active:bg-white-700 transition-all active:scale-[0.99]"
>
<LogIn />
</Button> */
}
