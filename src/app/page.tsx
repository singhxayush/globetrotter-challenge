import {Lato, Oswald, Roboto} from "next/font/google";
import {Button} from "@/components/ui/button";
import {auth, signOut} from "@/auth";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {LogIn, LogOut} from "lucide-react";
// import {FaMapMarkedAlt} from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// const font = Cherry_Bomb_One({
//   subsets: ["latin"],
//   weight: ["400"],
// });

const Headerfont = Oswald({
  subsets: ["cyrillic"],
  weight: ["400"],
});

const fontRoboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["500", "100", "300", "400"],
});

const fontLato = Lato({
  subsets: ["latin"],
  weight: ["100", "300"],
});

const HomePage = async () => {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({redirectTo: "/"});
  }

  return (
    <main className="overflow-auto overflow-x-hidden">
      <section className="flex h-[100dvh] w-full bg-[#F8F8FF] scroll-smooth">
        {/* <div className="radial-dot-background w-full fixed h-screen"></div> */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between 
          items-center bg-[#1e1e1f] px-4 py-2
          motion-translate-y-in-[-200%] motion-ease motion-duration-500"
        >
          <div className="flex items-center justify-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={50} height={50} />
            <h1
              className={cn(
                "text-white/90 text-xl font-light",
                fontRoboto.className
              )}
            >
              Globetrotter
            </h1>
          </div>
          <div className="mr-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={session?.user?.image || "/profile.svg"}
                    width={50}
                    height={50}
                    alt={session?.user?.name || "Profile"}
                    className="w-9 h-9 rounded-xl border-[2px] border-neutral-700 cursor-pointer bg-neutral-200"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-neutral-900 text-zinc-300 border-px mr-6 mt-2">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button
                  className="motion-preset-focus-lg motion-duration-2000 group-hover text-neutral-950 bg-white-500 
                rounded-lg px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 hover:shadow-none
                active:shadow-none active:bg-white-700 transition-all active:scale-[0.99]"
                >
                  <LogIn />
                </Button>
              </Link>
            )}
          </div>
        </nav>

        <div className="w-full flex items-center justify-end p-6 relative">
          <Image
            src="/landing.svg"
            alt="landing"
            width={900}
            height={900}
            className="mt-20 bg-yellow-300 shadow-lg shadow-black/10 border-[1pt] p-10 rounded-2xl"
          />

          <div className="absolute left-4 top-20 flex flex-col gap-10">
            <h1
              className={cn(
                "header_bg font-bold text-[5rem] motion-preset-focus-lg -motion-translate-y-in-25 motion-duration-[1.5s]",
                Headerfont.className
              )}
            >
              Globetrotter
            </h1>

            <p
              className={cn(
                "text-md ml-2 motion-preset-focus-lg motion-delay-[0.5s] -motion-translate-y-in-25 motion-duration-[2s]",
                fontLato.className
              )}
              style={{fontWeight: "0.1pt"}}
            >
              Guess the World, One Clue at a Time!
              <br />
              An interactive travel guessing game where users solve cryptic
              clues,
              <br />
              unlock fun facts, and challenge friends to beat their scores!
            </p>

            <Link href={"/game"}>
              <Button
                type="submit"
                className="motion-preset-focus-lg border-spacing-4 border-[1pt] border-neutral-700 
                w-[180px] h-[50px] motion-duration-2000 group-hover text-neutral-600 bg-transparent hover:bg-[#F8F8FF/10]
                px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 active:shadow-none 
                shadow-white-400/30 active:bg-white-700 transition-all active:scale-[0.99] text-xl 
                font-bold rounded-sm ml-2"
              >
                Play
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full h-[100dvh] bg-[#F8F8FF]"></section>
      <section className="w-full h-[100dvh] bg-[#F8F8FF]"></section>
    </main>
  );
};

export default HomePage;
