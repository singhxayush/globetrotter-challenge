import {Barlow, Lato} from "next/font/google";
import {cn} from "@/lib/utils";
import Image from "next/image";
import HomepagePlayButton from "@/components/landing/HomepagePlayButton";

const Headerfont = Barlow({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  preload: true,
});

const fontLato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const HomePage = async () => {
  return (
    <main className="overflow-auto overflow-x-hidden">
      <section className="landing_section relative overflow-hidden">
        <div className="absolute z-[1000]">
          <div className="w-[100dvw] h-[100vh] bg-[#F8F8FF]/20 lg:bg-transparent flex flex-col mt-20 items-center sm:items-start sm:pl-10 pl-0 backdrop-blur-sm md:backdrop-blur-[2px] lg:backdrop-blur-0">
            <h1
              className={cn(
                "text-[3.5rem] text-left sm:text-center sm:text-[7rem] md:text-[7.5rem] font-semibold bg-gradient-to-b from-zinc-600 to-zinc-700 text-transparent bg-clip-text motion-preset-focus-lg -motion-translate-y-in-25 motion-duration-[1s] transition-all duration-500",
                Headerfont.className
              )}
            >
              Globetrotter
            </h1>

            <p
              className={cn(
                "text-[12px] sm:text-lg mx-2 sm:ml-2 text-center sm:text-start mb-10 motion-preset-focus-lg motion-delay-[0.3s] -motion-translate-y-in-25 motion-duration-[1.2s]",
                fontLato.className
              )}
              style={{fontWeight: "0.1pt"}}
            >
              <b>Guess the World, One Clue at a Time!</b>
              <br />
              An interactive travel guessing game where users solve cryptic
              clues,
              <br />
              unlock fun facts, and challenge friends to beat their scores!
            </p>

            <HomepagePlayButton />
          </div>
        </div>

        <div className="absolute bottom-0 right-0">
          <Image
            src="/landing.svg"
            alt="landing"
            width={1000}
            height={1000}
            className="pointer-events-none scale-[1.7] xs:scale-[1.4] sm:scale-[1.2] md:scale-[0.8] lg:scale-[0.8] origin-bottom-right translate-x-[7rem] sm:translate-x-0 transition-all motion-preset-blur-up-lg motion-duration-[4s]"
          />
        </div>

        <div className="section1_bottom_fade_bottom absolute bottom-0 left-0 w-full h-[30%]" />
      </section>
      <section className="landing_section"></section>
      <section className="landing_section"></section>
    </main>
  );
};

export default HomePage;
