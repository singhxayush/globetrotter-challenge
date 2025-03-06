import {Lato, Oswald, Roboto} from "next/font/google";
import {Button} from "@/components/ui/button";
import {auth, signOut} from "@/auth";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {LogIn} from "lucide-react";
import Link from "next/link";
import {NavDropdown} from "@/components/NarDropdown";

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
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-full h-20 flex justify-between 
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
        <div className="mr-2">
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

      <section className="landing_section flex">
        {/* <div className="w-full relative">
          <Image
            src="/landing.svg"
            alt="landing"
            width={0}
            height={0}
            className="absolute left-0  mt-20 md:w-[60%] md:opacity-100 opacity-10"
          />
        </div> */}

        <div className="absolute left-4 top-20 flex flex-col gap-10">
          <h1
            className={cn(
              "header_bg font-bold text-[5rem] motion-preset-focus-lg -motion-translate-y-in-25 motion-duration-[1s]",
              Headerfont.className
            )}
          >
            Globetrotter
          </h1>

          <p
            className={cn(
              "text-md ml-2 motion-preset-focus-lg motion-delay-[0.3s] -motion-translate-y-in-25 motion-duration-[1.2s]",
              fontLato.className
            )}
            style={{fontWeight: "0.1pt"}}
          >
            Guess the World, One Clue at a Time!
            <br />
            An interactive travel guessing game where users solve cryptic clues,
            <br />
            unlock fun facts, and challenge friends to beat their scores!
          </p>

          <Link href={"/game"}>
            <Button
              type="submit"
              className="border-spacing-4 border-[1pt] border-neutral-700 
                w-[180px] h-[50px] group-hover text-neutral-600 bg-transparent hover:bg-[#F8F8FF/10]
                px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 active:shadow-none 
                shadow-white-400/30 active:bg-white-700 transition-all active:scale-[0.99] text-xl 
                font-bold rounded-sm ml-2 motion-preset-focus-lg motion-delay-[0.6s] -motion-translate-y-in-25 motion-duration-[1.2s]"
            >
              Play
            </Button>
          </Link>
        </div>
      </section>
      <section className="landing_section"></section>
      <section className="landing_section"></section>
    </main>
  );
};

export default HomePage;

{
  /* <Image
                  src={session?.user?.image || "/profile.svg"}
                  width={40}
                  height={40}
                  alt={session?.user?.name || "Profile"}
                  className="rounded-full cursor-pointer bg-neutral-200"
                /> */
}
