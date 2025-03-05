import {Poppins, Roboto} from "next/font/google";
import {Button} from "@/components/ui/button";
import {auth, signOut} from "@/auth";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {LogIn, LogOut} from "lucide-react";
import {FaMapMarkedAlt} from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const fontNav = Roboto({
  subsets: ["cyrillic"],
  weight: ["500"],
});

const HomePage = async () => {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({redirectTo: "/"});
  }

  return (
    <>
      <main
        className="flex h-full flex-col items-center justify-start bg-[#F8F8FF] scroll-smooth overflow-hidden"
      >
        {/* <div className="radial-dot-background w-full fixed h-screen"></div> */}
        <nav
          className="sticky top-2 left-0 right-0 z-50 w-full sm:w-[70%] md:w-[60%] mx-2 flex justify-between 
          items-center bg-zinc-900/20 px-4 py-2 rounded-lg backdrop-blur-md backdrop-brightness-70 border-[1px] border-neutral-200/5
          motion-translate-y-in-[-200%] motion-ease motion-duration-500"
        >
          <h1 className={cn("text-white/90 text-xl", fontNav.className)}>
            Globetrotter
          </h1>
          <div>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={session?.user?.image || "/profile.svg"}
                    width={50}
                    height={50}
                    alt={session?.user?.name || "Profile"}
                    className="w-9 h-9 rounded-xl border-[2px] border-neutral-700 cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-neutral-900 text-zinc-300 border-px mr-6 mt-2 md:m-0">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button
                  className="motion-preset-focus-lg motion-duration-2000 group-hover text-neutral-950 bg-lime-500 
                rounded-lg px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-lime-500 hover:shadow-none
                active:shadow-none active:bg-lime-700 transition-all active:scale-[0.99]"
                >
                  <LogIn />
                </Button>
              </Link>
            )}
          </div>
        </nav>
        <div className="space-y-6 text-center group mt-[35%] sm:mt-[30%] md:mt-[12%]">
          <div
            className={cn(
              "flex items-center flex-wrap gap-2 justify-center w-full sm:text-7xl text-5xl font-semibold text-white drop-shadow-md cursor-default motion-scale-in-[0.5] motion-translate-y-in-[-2000%] motion-duration-2000",
              font.className
            )}
          >
            <h1 className="header_bg pb-3">Globetrotter </h1>
            <FaMapMarkedAlt className="w-16 h-16 sm:w-24 sm:h-24 stroke-[] rotate-[7deg] -translate-y-1 sm:-translate-y-2 mx-1 ml-2 transition-all text-lime-200" />
            {/* <h1 className="header_bg pb-3">Challenge</h1> */}
          </div>

          <div>
            <p className="text-white text-sm font-sans font-light">
              Guess the World, One Clue at a Time! An interactive travel
              guessing game where users
              <br />
              solve cryptic clues, unlock fun facts, and challenge friends to
              beat their scores! 🌍
            </p>
            <p className="text-white text-sm mt-4">BUILT USING</p>
            <p className="text-md font-sans font-semibold bg-gradient-to-r from-sky-400 to-pink-300 bg-clip-text text-transparent">
              [Next.js • AuthJs • Redis • PSQL]
            </p>
          </div>

          <div className="flex gap-2 items-center justify-center">
            <Link href={"/game"}>
              <Button
                type="submit"
                className="motion-preset-focus-lg w-[180px] h-[50px] motion-duration-2000 group-hover text-neutral-950 bg-lime-500 
              rounded-lg px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-lime-500 hover:shadow-none shadow-lime-400/30 
              active:shadow-none active:bg-lime-700 transition-all active:scale-[0.99] text-xl font-bold md:mt-10"
              >
                Play
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
