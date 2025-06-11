import Image from "next/image";
import React from "react";
import {Button} from "../ui/button";
import {Poppins} from "next/font/google";
import {cn} from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["800"],
});

type RoomNotFoundProps = {
  error: string;
};

const RoomNotFound = ({error}: RoomNotFoundProps) => {
  const buttonOnClick = () => {
    window.location.href = "/game";
  };
  console.log(error);
  return (
    <div className="w-full h-full flex justify-center relative overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-start absolute z-[1000] backdrop-blur-[2px] xs:backdrop-blur-none rounded-md p-2 mt-[10%] xs:mt-[5%]">
        <h1
          className={cn(
            "text-4xl xs:text-5xl md:text-6xl items-center font-sans font-bold bg-gradient-to-b from-transparent to-neutral-900/0 text-transparent",
            font.className
          )}
          style={{
            WebkitTextStroke: "1.4px black",
          }}
        >
          Room not found
        </h1>

        <p className="font-light font-sans text-[12px] xs:text-[16px] rounded-md xs:mt-2">
          The game room you are trying to join does not exist.
        </p>

        <Button
          onClick={buttonOnClick}
          className="border-spacing-4 border-[0.7pt] border-neutral-700 mt-12
                    w-[180px] h-[50px] group-hover text-neutral-600 bg-[#F8F8FF]/60
                    px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 active:shadow-none 
                    shadow-white-400/30 active:bg-white-700 transition-all active:scale-[0.99] text-xl sm:text-2xl backdrop-blur-sm
                    font-bold rounded-sm motion-preset-focus-lg motion-delay-[0.6s] -motion-translate-y-in-25 motion-duration-[1.2s]"
        >
          <span className="flex items-center gap-2">Main Menu</span>
        </Button>
      </div>
      <div className="w-auto pointer-events-none z-0 h-full flex justify-center items-end absolute bottom-0">
        <Image
          src="/error1.svg"
          alt="Room Not found"
          width={0}
          height={0}
          className="w-full h-full origin-bottom scale-[1.5] translate-y-[30%] translate-x-5 xs:scale-[1.2] xs:translate-y-10 xs:translate-x-10 sm:scale-[0.9] sm:translate-y-0 motion-preset-blur-up-lg motion-duration-[3s]"
        />
      </div>
    </div>
  );
};

export default RoomNotFound;
