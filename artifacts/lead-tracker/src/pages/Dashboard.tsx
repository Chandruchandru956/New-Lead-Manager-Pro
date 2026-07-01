import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLeads } from "@/hooks/useLeads";
import { LeadCard } from "@/components/leads/LeadCard";
import { LeadTable } from "@/components/leads/LeadTable";
import { StageFilter } from "@/components/leads/StageFilter";
import { Stage, STAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { leads, isLoading, updateLead } = useLeads();
  const [activeFilter, setActiveFilter] = useState<Stage | "All">("All");

  const filteredLeads = useMemo(() => {
    if (activeFilter === "All") return leads;
    return leads.filter((lead) => lead.stage === activeFilter);
  }, [leads, activeFilter]);

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

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Loading pipeline...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Pipeline Overview">
      <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
            <p className="text-muted-foreground text-sm">
              You have {leads.length} total leads across all stages.
            </p>
          </div>
          <Button asChild className="gap-2 shadow-sm">
            <Link href="/leads/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Lead</span>
            </Link>
          </Button>
        </div>

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

        {/* List Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <StageFilter 
              activeFilter={activeFilter} 
              onChange={setActiveFilter} 
            />
          </div>
          
          <LeadTable 
            leads={filteredLeads} 
            onStageChange={handleStageChange} 
          />
        </div>
        
      </div>
    </Layout>
  );
}
