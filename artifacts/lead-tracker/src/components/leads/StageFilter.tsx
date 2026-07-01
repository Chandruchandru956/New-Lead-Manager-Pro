import { Stage, STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StageFilterProps {
  activeFilter: Stage | "All";
  onChange: (stage: Stage | "All") => void;
  className?: string;
}

export function StageFilter({ activeFilter, onChange, className }: StageFilterProps) {
  
  const getStageColorClass = (stage: Stage | "All", isActive: boolean) => {
    if (!isActive) return "bg-background text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground";
    
    if (stage === "All") return "bg-primary text-primary-foreground border-primary shadow-sm";
    
    // Colored active states
    const map: Record<Stage, string> = {
      New: "bg-slate-700 text-white border-slate-700",
      Contacted: "bg-blue-600 text-white border-blue-600",
      Qualified: "bg-violet-600 text-white border-violet-600",
      Proposal: "bg-amber-600 text-white border-amber-600",
      Won: "bg-emerald-600 text-white border-emerald-600",
      Lost: "bg-red-600 text-white border-red-600",
    };
    
    return `${map[stage]} shadow-sm`;
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-1 bg-card border rounded-full shadow-sm w-fit", className)}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange("All")}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border relative",
          getStageColorClass("All", activeFilter === "All")
        )}
      >
        All
      </motion.button>
      
      {STAGES.map((stage) => (
        <motion.button
          whileTap={{ scale: 0.95 }}
          key={stage}
          onClick={() => onChange(stage)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border relative",
            getStageColorClass(stage, activeFilter === stage)
          )}
        >
          {stage}
        </motion.button>
      ))}
    </div>
  );
}
