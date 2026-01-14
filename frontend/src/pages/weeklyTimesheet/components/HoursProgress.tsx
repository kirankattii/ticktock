interface HoursProgressProps {
  totalHours: number;
  targetHours?: number;
  className?: string;
}

export default function HoursProgress({
  totalHours,
  targetHours = 40,
  className = "",
}: HoursProgressProps) {
  const completed = Math.min(totalHours, targetHours);
  const percentage = Math.min((completed / targetHours) * 100, 100);

  return (
    <div className={`w-56 ${className}`}>
      {/* Top Row */}
      <div className="text-xs text-gray-600 mb-1 relative">
        <span className="font-medium flex items-center justify-center -mb-2">
          {completed}/{targetHours} hrs
        </span>
        <div className="flex items-center gap-1 justify-end">
          <span className="text-gray-400">{Math.round(percentage)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-orange-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
