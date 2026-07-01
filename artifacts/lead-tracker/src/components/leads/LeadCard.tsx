import { Stage, STAGE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserPlus, Phone, CheckCircle, FileText, Trophy, XCircle } from "lucide-react";

interface LeadCardProps {
  stage: Stage;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const STAGE_ICONS: Record<Stage, any> = {
  New: UserPlus,
  Contacted: Phone,
  Qualified: CheckCircle,
  Proposal: FileText,
  Won: Trophy,
  Lost: XCircle,
};

// Fake trends for visual depth
const TRENDS: Record<Stage, string> = {
  New: "+12 this week",
  Contacted: "+5 this week",
  Qualified: "+2 this week",
  Proposal: "+3 this week",
  Won: "+1 this week",
  Lost: "-2 this week",
};

export function LeadCard({ stage, count, isActive, onClick }: LeadCardProps) {
  const colors = STAGE_COLORS[stage];
  
  // Extract background for icon container
  const bgMatch = colors.match(/bg-([a-z]+)-(\d+)/);
  const colorName = bgMatch ? bgMatch[1] : "primary";
  const iconBgClass = `bg-${colorName}-100 dark:bg-${colorName}-900/30 text-${colorName}-600 dark:text-${colorName}-400`;
  const sparklineColor = `bg-${colorName}-400 dark:bg-${colorName}-500`;

  const Icon = STAGE_ICONS[stage];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Filter by ${stage} stage — ${count} lead${count !== 1 ? "s" : ""}`}
      className={cn(
        "cursor-pointer transition-all duration-300 rounded-2xl bg-card border relative overflow-hidden group p-5",
        isActive 
          ? "ring-2 ring-primary border-transparent glow-primary" 
          : "hover:border-primary/40 shadow-sm hover:shadow-md"
      )}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl transition-colors duration-300", iconBgClass, isActive ? "scale-110 shadow-sm" : "")}>
          <Icon className="w-5 h-5" />
        </div>
        {/* Mini sparkline visualization */}
        <div className="flex items-end gap-1 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
          {[40, 70, 30, 80, 50, 100].map((h, i) => (
            <div 
              key={i} 
              className={cn("w-1 rounded-t-sm", sparklineColor)} 
              style={{ height: `${h}%` }} 
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{stage}</h3>
        <div className="flex items-baseline gap-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            key={count}
            className="text-3xl font-bold tracking-tight text-foreground"
          >
            {count}
          </motion.div>
        </div>
        <p className="text-xs font-medium text-muted-foreground mt-2 inline-block px-2 py-0.5 bg-muted/50 rounded-md">
          {TRENDS[stage]}
        </p>
      </div>
      
      {/* Decorative gradient blur in corner when active */}
      {isActive && (
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
      )}
    </motion.div>
  );
}
