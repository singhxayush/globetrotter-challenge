import {QuestionData} from "@/app/(game)/play/page";
import {motion, AnimatePresence} from "framer-motion";
import {ListOrdered, PartyPopper, X} from "lucide-react";

// OptionsPanel Component
export function OptionsPanel({
  questionData,
  selectedOption,
  setSelectedOption,
  feedback,
  loading,
  handleSubmitAnswer,
  skipQuestion,
}: {
  questionData: QuestionData | null;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  feedback: {
    message: string;
    isCorrect: boolean | null;
    correctAnswer: string | null;
  };
  loading: boolean;
  handleSubmitAnswer: () => void;
  skipQuestion: () => void;
}) {
  return (
    <div className="p-6">
      <div className="flex gap-2 items-center mb-4">
        <ListOrdered />
        <h3 className="text-lg font-semibold">Select the correct city:</h3>
      </div>
      <div className="grid grid-cols-1 gap-2 mb-4">
        {questionData?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`md:p-4 p-2 text-left rounded-lg border-2 transition-all ${
              selectedOption === option
                ? "bg-sky-100 border-sky-500 shadow-md"
                : "bg-neutral-100 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            } ${
              feedback.isCorrect !== null && feedback.correctAnswer === option
                ? "bg-green-100 border-green-500"
                : ""
            }`}
            disabled={loading || feedback.isCorrect !== null}
          >
            {String.fromCharCode(65 + index) + ". "}
            {option}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback.message && (
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className={`mb-4 p-2 rounded-md ${
              feedback.isCorrect
                ? "bg-green-50 text-green-800 border border-green-200"
                : feedback.isCorrect === false
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            <div className="flex items-center">
              {feedback.isCorrect ? (
                <span className="mr-2">
                  <PartyPopper />
                </span>
              ) : feedback.isCorrect === false ? (
                <span className="mr-2">
                  <X className="text-red-500 stroke-[4px]" />
                </span>
              ) : (
                <span className="mr-2">ℹ️</span>
              )}
              <span>{feedback.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex space-x-3">
        <button
          onClick={handleSubmitAnswer}
          disabled={loading || !selectedOption || feedback.isCorrect !== null}
          className={`flex-1 rounded-lg font-medium transition-colors duration-200 py-4 ${
            !selectedOption || loading || feedback.isCorrect !== null
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Submit Answer
        </button>
        {feedback.isCorrect !== null ? (
          <button
            onClick={skipQuestion} // In this state, "Next Question" triggers the same function.
            disabled={loading}
            className="flex-1 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={skipQuestion}
            disabled={loading}
            className="flex-1 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
}
