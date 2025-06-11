import React from "react";
import {Button} from "../ui/button";
import {VscDebugRestart} from "react-icons/vsc";
import {FaExclamationTriangle} from "react-icons/fa";

type SubmitOrRestartProps = {
  startGame: () => Promise<void>;
  handleEndGame: () => Promise<void>;
};

const SubmitOrRestart = ({startGame, handleEndGame}: SubmitOrRestartProps) => {
  return (
    <div className="flex w-full items-center justify-evenly md:gap-2 mt-10 md:mt-0">
      <Button
        onClick={startGame}
        className="w-full md:w-24 h-8 text-md md:text-md bg-sky-500 shadow-md shadow-black/20 hover:bg-sky-700 hover:shadow-none rounded-none md:rounded-md"
      >
        Restart
        <VscDebugRestart />
      </Button>
      <Button
        onClick={handleEndGame}
        className="w-full md:w-24 h-8 text-md bg-red-500 shadow-md shadow-black/20 hover:bg-red-700 hover:shadow-none rounded-none md:rounded-md"
      >
        Submit
        <FaExclamationTriangle className="h-10 w-10" />
      </Button>
    </div>
  );
};

export default SubmitOrRestart;
