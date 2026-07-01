import { Stage, STAGE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface LeadCardProps {
  stage: Stage;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function LeadCard({ stage, count, isActive, onClick }: LeadCardProps) {
  const colors = STAGE_COLORS[stage];
  
  // Extract just the background color for a subtle dot indicator
  const bgMatch = colors.match(/bg-([a-z]+)-(\d+)/);
  const dotColorClass = bgMatch ? `bg-${bgMatch[1]}-500` : "bg-primary";

  return (
    <Card 
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Filter by ${stage} stage — ${count} lead${count !== 1 ? "s" : ""}`}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border",
        isActive ? "ring-2 ring-primary border-transparent" : "hover:border-primary/50"
      )}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
    >
      <CardContent className="p-4 flex flex-col items-start gap-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", dotColorClass)} />
            {stage}
          </span>
        </div>
        <div className="text-3xl font-bold tracking-tight">{count}</div>
      </CardContent>
    </Card>
  );
}
