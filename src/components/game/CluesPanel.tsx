import {QuestionData} from "@/app/(game)/play/page";
import {BrainCircuit, Flame, Search} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";

// CluesPanel Component
export function CluesPanel({
  questionData,
  revealedClues,
  showFunFacts,
}: {
  questionData: QuestionData | null;
  revealedClues: number;
  showFunFacts: boolean;
}) {
  return (
    <div className="p-6 border-r border-gray-200 min-h-[20dvh]">
      {!showFunFacts && (
        <>
          <div className="flex gap-2 items-center mb-4">
            <BrainCircuit />
            <h2 className="text-xl font-semibold">Clues:</h2>
          </div>
          <ul className="space-y-3 mb-6">
            {questionData?.clues.slice(0, revealedClues).map((clue, index) => (
              <motion.li
                key={index}
                initial={{opacity: 0, x: -10}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: index * 0.2}}
                className="flex items-start p-3 bg-blue-50 rounded-md"
              >
                <span className="text-blue-500 mr-2">
                  <Search />
                </span>
                <span className="text-gray-700">{clue}</span>
              </motion.li>
            ))}
            {questionData && revealedClues < questionData.clues.length && (
              <li className="text-sm text-gray-500 italic p-2">
                More clues will be revealed soon...
              </li>
            )}
          </ul>
        </>
      )}

      {/* Fun Facts */}
      <AnimatePresence>
        {showFunFacts && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: "auto"}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.3}}
          >
            <div className="flex gap-2">
              <Flame />
              <h3 className="text-lg font-semibold  mb-2">Fun Facts:</h3>
            </div>
            <div className="space-y-3">
              {questionData?.funFacts.map((fact, index) => (
                <div
                  key={index}
                  className="p-3 bg-purple-50 rounded-md text-gray-700 border-l-4 border-purple-300"
                >
                  {fact}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
