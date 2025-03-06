import {Barlow, Lato, Roboto} from "next/font/google";
import {Button} from "@/components/ui/button";
import {auth, signOut} from "@/auth";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {LogIn} from "lucide-react";
import Link from "next/link";
import {NavDropdown} from "@/components/NarDropdown";
import HomepagePlayButton from "@/components/HomepagePlayButton";

const Headerfont = Barlow({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  preload: true,
});

const fontRoboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["500", "100", "300", "400"],
});

const fontLato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const HomePage = async () => {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut({redirectTo: "/"});
  }

  return (
    <main className="overflow-auto overflow-x-hidden">
      <nav
        className="fixed top-0 left-0 right-0 z-[2000] w-full h-20 flex justify-between 
          items-center bg-white shadow-xl shadow-neutral-800/10 px-4 py-2
          motion-translate-y-in-[-200%] motion-ease motion-duration-500 border-b-[0.1pt] border-black/40"
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
              "text-neutral-600 text-xl font-normal",
              fontRoboto.className
            )}
          >
            Globetrotter
          </h1>
        </div>

        {/* Right - DROPDOWN */}
        <div className="mr-0 sm:mr-2">
          {session ? (
            <NavDropdown handleSignOut={handleSignOut} session={session} />
          ) : (
            <Link href="/auth/login">
              <Button
                className="motion-preset-focus-lg motion-duration-2000 group-hover text-neutral-950 bg-white-500 border-[0.11pt] border-black/20
                rounded-lg px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 hover:shadow-none
                active:shadow-none active:bg-white-700 transition-all active:scale-[0.99]"
              >
                <LogIn />
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <section className="landing_section relative overflow-hidden">
        <div className="absolute z-10">
          <div className="w-[100dvw] h-[100dvh] flex flex-col mt-20 items-start sm:ml-10 pl-2 backdrop-blur-sm sm:backdrop-blur-0">
            <h1
              className={cn(
                "text-[3.5rem] sm:text-[5rem] font-semibold bg-gradient-to-b from-zinc-600 to-zinc-700 text-transparent bg-clip-text motion-preset-focus-lg -motion-translate-y-in-25 motion-duration-[1s]",
                Headerfont.className
              )}
            >
              Globetrotter
            </h1>

            <p
              className={cn(
                "text-sm sm:text-lg ml-1 mb-10 text-start motion-preset-focus-lg motion-delay-[0.3s] -motion-translate-y-in-25 motion-duration-[1.2s]",
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

            <HomepagePlayButton />
          </div>
        </div>

        <div className="absolute -bottom-20 -right-36">
          <Image
            src="/landing.svg"
            alt="landing"
            width={1000}
            height={1000}
            className="scale-x-[-1.4] scale-y-[1.4] sm:scale-x-[-0.85] sm:scale-y-[0.85] pointer-events-none"
          />
        </div>
      </section>
      <section className="landing_section"></section>
      <section className="landing_section"></section>
    </main>
  );
};

export default HomePage;
