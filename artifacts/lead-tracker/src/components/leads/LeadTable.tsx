import { Lead, Stage, STAGES } from "@/lib/constants";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import { StageBadge } from "./StageBadge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, User, ChevronUp, ChevronDown, Inbox } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadTableProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: Stage) => void;
  isLoading?: boolean;
  onRowClick?: (leadId: string) => void;
  sortField?: keyof Lead;
  sortDir?: "asc" | "desc";
  onSort?: (field: keyof Lead) => void;
}

export function LeadTable({ 
  leads, 
  onStageChange, 
  isLoading, 
  onRowClick,
  sortField,
  sortDir,
  onSort
}: LeadTableProps) {
  
  const SortIcon = ({ field }: { field: keyof Lead }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp className="w-4 h-4 inline-block ml-1" /> : <ChevronDown className="w-4 h-4 inline-block ml-1" />;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="h-12"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><div className="flex items-center gap-2"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-4 w-20" /></div></TableCell>
                <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border rounded-2xl bg-card text-muted-foreground shadow-sm">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No leads found</h3>
        <p className="text-sm max-w-sm text-muted-foreground">
          We couldn't find any leads matching your criteria. Try adjusting your filters or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead 
                className="w-[250px] font-semibold cursor-pointer select-none" 
                onClick={() => onSort?.("name")}
              >
                Lead {sortField === "name" && <SortIcon field="name" />}
              </TableHead>
              <TableHead className="font-semibold">Service</TableHead>
              <TableHead className="hidden md:table-cell font-semibold">City</TableHead>
              <TableHead 
                className="text-right hidden sm:table-cell font-semibold cursor-pointer select-none"
                onClick={() => onSort?.("budget")}
              >
                Budget {sortField === "budget" && <SortIcon field="budget" />}
              </TableHead>
              <TableHead className="w-[180px] font-semibold">Stage</TableHead>
              <TableHead className="hidden lg:table-cell font-semibold">Owner</TableHead>
              <TableHead 
                className="text-right hidden xl:table-cell font-semibold cursor-pointer select-none"
                onClick={() => onSort?.("updatedAt")}
              >
                Updated {sortField === "updatedAt" && <SortIcon field="updatedAt" />}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {leads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="group hover:bg-muted/40 transition-colors border-b last:border-0"
                  onClick={() => onRowClick?.(lead.id)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  <TableCell>
                    <div className="flex flex-col gap-1.5 py-1">
                      <span className="font-medium text-[15px] group-hover:text-primary transition-colors group-hover:underline underline-offset-4 decoration-primary/30">
                        {lead.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {lead.businessName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {lead.service}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {lead.city || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-right font-semibold hidden sm:table-cell">
                    <span className={lead.budget && lead.budget > 2000 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}>
                      {formatCurrency(lead.budget)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={lead.stage}
                        onValueChange={(value) => onStageChange(lead.id, value as Stage)}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs border-0 bg-transparent hover:bg-muted p-0 focus:ring-0 gap-1 justify-start">
                          <StageBadge stage={lead.stage} />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage} className="text-xs font-medium">
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {getInitials(lead.owner)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{lead.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground text-right hidden xl:table-cell">
                    {formatRelativeDate(lead.updatedAt)}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{leads.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
