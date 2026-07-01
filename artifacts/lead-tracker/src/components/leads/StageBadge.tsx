import { Stage, STAGE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StageBadgeProps {
  stage: Stage;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  // Enhanced premium gradients for stages
  const STAGE_GRADIENTS: Record<Stage, string> = {
    New: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-200/50 dark:from-slate-800 dark:to-slate-800/80 dark:text-slate-300 dark:border-slate-700",
    Contacted: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200/50 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300 dark:border-blue-800/50",
    Qualified: "bg-gradient-to-r from-violet-100 to-violet-50 text-violet-700 border-violet-200/50 dark:from-violet-900/40 dark:to-violet-900/20 dark:text-violet-300 dark:border-violet-800/50",
    Proposal: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200/50 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300 dark:border-amber-800/50",
    Won: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200/50 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50",
    Lost: "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-200/50 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-300 dark:border-red-800/50",
  };

  const style = STAGE_GRADIENTS[stage] || STAGE_COLORS[stage];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border shadow-sm",
        style,
        className
      )}
    >
      {stage === "Won" && <Check className="w-3 h-3" />}
      {stage}
    </span>
  );
}
