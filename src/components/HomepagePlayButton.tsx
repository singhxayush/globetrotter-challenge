"use client";

import React from "react";
import {Button} from "./ui/button";

const HomepagePlayButton = () => {
  const handleButtonClick = () => {
    window.location.href = "/game";
  };
  return (
    <Button
      onClick={handleButtonClick}
      type="submit"
      className="border-spacing-4 border-[0.7pt] border-neutral-700 sm:ml-1
                    w-[180px] h-[50px] group-hover text-neutral-600 bg-transparent hover:bg-[#F8F8FF/10]
                    px-4 py-2 hover:cursor-pointer shadow-lg hover:bg-white-500 active:shadow-none 
                    shadow-white-400/30 active:bg-white-700 transition-all active:scale-[0.99] text-xl backdrop-blur-sm
                    font-bold rounded-sm motion-preset-focus-lg motion-delay-[0.6s] -motion-translate-y-in-25 motion-duration-[1.2s]"
    >
      Play
    </Button>
  );
};

export default HomepagePlayButton;
