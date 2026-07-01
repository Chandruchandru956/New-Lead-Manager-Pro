import { Stage, STAGE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StageBadgeProps {
  stage: Stage;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const colors = STAGE_COLORS[stage];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        colors,
        className
      )}
    >
      {stage}
    </span>
  );
}
