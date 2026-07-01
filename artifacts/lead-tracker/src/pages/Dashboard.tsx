import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLeads } from "@/hooks/useLeads";
import { LeadCard } from "@/components/leads/LeadCard";
import { LeadTable } from "@/components/leads/LeadTable";
import { StageFilter } from "@/components/leads/StageFilter";
import { LeadDrawer } from "@/components/leads/LeadDrawer";
import { Stage, STAGES, Lead } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { leads, isLoading, updateLead, deleteLead } = useLeads();
  const [activeFilter, setActiveFilter] = useState<Stage | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  const [sortField, setSortField] = useState<keyof Lead>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filteredLeads = useMemo(() => {
    let result = leads;
    
    // Filter by stage
    if (activeFilter !== "All") {
      result = result.filter((lead) => lead.stage === activeFilter);
    }
    
    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((lead) => 
        lead.name.toLowerCase().includes(q) || 
        lead.businessName.toLowerCase().includes(q) ||
        lead.owner.toLowerCase().includes(q) ||
        (lead.city && lead.city.toLowerCase().includes(q))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return sortDir === "asc" ? 1 : -1;
      if (bVal === undefined) return sortDir === "asc" ? -1 : 1;
      
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [leads, activeFilter, searchQuery, sortField, sortDir]);

  const stageCounts = useMemo(() => {
    const counts = STAGES.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {} as Record<Stage, number>);
    
    leads.forEach((lead) => {
      if (counts[lead.stage] !== undefined) {
        counts[lead.stage]++;
      }
    });
    
    return counts;
  }, [leads]);

  const handleStageChange = (leadId: string, newStage: Stage) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.stage !== newStage) {
      updateLead({ ...lead, stage: newStage });
    }
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc"); // Default to asc for new field
      if (field === "updatedAt" || field === "budget") setSortDir("desc"); // Except for these
    }
  };

  const handleRowClick = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  return (
    <Layout title="Pipeline Overview">
      <div className="flex flex-col gap-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1 text-foreground">Good morning, Chandru 👋</h2>
            <p className="text-muted-foreground font-medium">
              You have {leads.length} active leads across your pipeline.
            </p>
          </div>
          <Button asChild className="gap-2 shadow-sm rounded-full px-6 h-11 active:scale-95 transition-transform shrink-0">
            <Link href="/leads/new">
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Add Lead</span>
            </Link>
          </Button>
        </motion.div>

        {/* Stage Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map((stage) => (
            <LeadCard
              key={stage}
              stage={stage}
              count={stageCounts[stage]}
              isActive={activeFilter === stage}
              onClick={() => setActiveFilter(activeFilter === stage ? "All" : stage)}
            />
          ))}
        </div>

        {/* Filters and List Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-2xl border shadow-sm">
            <StageFilter 
              activeFilter={activeFilter} 
              onChange={setActiveFilter} 
            />
            {/* Additional desktop search for the table context, layout has global one too */}
            <div className="relative w-full sm:w-64 shrink-0">
              <input 
                type="search"
                placeholder="Filter table..."
                className="w-full h-10 px-4 rounded-full border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <LeadTable 
            leads={filteredLeads} 
            isLoading={isLoading}
            onStageChange={handleStageChange} 
            onRowClick={handleRowClick}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
        </div>
      </div>
      
      <LeadDrawer 
        leadId={selectedLeadId}
        leads={leads}
        onClose={() => setSelectedLeadId(null)}
        onUpdate={updateLead}
        onDelete={deleteLead}
      />
    </Layout>
  );
}
