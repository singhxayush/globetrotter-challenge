// TimerBar Component
export function TimerBar({
  timeRemaining,
  totalTime,
}: {
  timeRemaining: number;
  totalTime: number;
}) {
  const percentage = (timeRemaining / totalTime) * 100;
  const progressColor =
    percentage > 60
      ? "bg-green-600"
      : percentage > 30
      ? "bg-yellow-400"
      : "bg-red-600";

  return (
    <div className="w-full bg-gray-200 h-2">
      <div
        className={`h-2 ${progressColor}`}
        style={{width: `${percentage}%`, transition: "width 1s linear"}}
      ></div>
    </div>
  );
}
