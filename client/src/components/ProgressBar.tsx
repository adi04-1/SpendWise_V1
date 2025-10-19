interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ value, max, showLabel = false, size = "md" }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  
  const getColor = () => {
    if (percentage < 60) return "bg-success";
    if (percentage < 90) return "bg-warning";
    return "bg-error";
  };

  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className="w-full">
      <div className={`w-full ${heightClass} bg-muted rounded-full overflow-hidden`}>
        <div
          className={`${heightClass} ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>₹{value.toLocaleString()}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
