import { Lead, Stage, STAGES } from "@/lib/constants";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import { StageBadge } from "./StageBadge";
import { Link } from "wouter";
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
import { Building2, User } from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: Stage) => void;
}

export function LeadTable({ leads, onStageChange }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-lg bg-card text-muted-foreground border-dashed">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No leads found</h3>
        <p className="text-sm max-w-sm">
          We couldn't find any leads matching your current filter. Try selecting a different stage or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px]">Lead</TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="hidden md:table-cell">City</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Budget</TableHead>
            <TableHead className="w-[150px]">Stage</TableHead>
            <TableHead className="hidden lg:table-cell">Owner</TableHead>
            <TableHead className="text-right hidden xl:table-cell">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="group hover:bg-muted/50 transition-colors">
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Link href={`/leads/${lead.id}`} className="font-medium hover:text-primary transition-colors hover:underline">
                    {lead.name}
                  </Link>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {lead.businessName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{lead.service}</TableCell>
              <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                {lead.city || "—"}
              </TableCell>
              <TableCell className="text-sm text-right font-medium hidden sm:table-cell">
                {formatCurrency(lead.budget)}
              </TableCell>
              <TableCell>
                {/* Prevent click propagation so clicking select doesn't trigger row click if we had one */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={lead.stage}
                    onValueChange={(value) => onStageChange(lead.id, value as Stage)}
                  >
                    <SelectTrigger className="h-8 text-xs border-0 bg-transparent hover:bg-muted p-0 pr-2 w-auto focus:ring-0 gap-1 justify-start">
                      <StageBadge stage={lead.stage} />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage} className="text-xs">
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                {lead.owner}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground text-right hidden xl:table-cell">
                {formatRelativeDate(lead.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
