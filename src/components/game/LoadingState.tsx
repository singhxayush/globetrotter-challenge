import React from "react";
import { FaRegCompass } from "react-icons/fa";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-full w-full gap-1">
      <span className="text-lg font-bold">Loading</span>
      <FaRegCompass className="motion-preset-seesaw-lg w-5 h-5 -rotate-12 stroke-[1px] motion-duration-1000" />
    </div>
  );
};

export default LoadingState;
