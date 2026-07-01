import { Stage, STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StageFilterProps {
  activeFilter: Stage | "All";
  onChange: (stage: Stage | "All") => void;
  className?: string;
}

export function StageFilter({ activeFilter, onChange, className }: StageFilterProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        onClick={() => onChange("All")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
          activeFilter === "All"
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
        )}
      >
        All Leads
      </button>
      
      {STAGES.map((stage) => (
        <button
          key={stage}
          onClick={() => onChange(stage)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
            activeFilter === stage
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          )}
        >
          {stage}
        </button>
      ))}
    </div>
  );
}
