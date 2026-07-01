import { useState, useCallback, useEffect } from "react";
import { Lead } from "@/lib/constants";
import { getLeads, saveLead, deleteLead as storageDeleteLead } from "@/lib/storage";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = useCallback(() => {
    setIsLoading(true);
    // Simulate slight delay to show loading states and make it feel like a real app
    setTimeout(() => {
      setLeads(getLeads());
      setIsLoading(false);
    }, 150);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = useCallback((lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveLead(newLead);
    fetchLeads();
    return newLead;
  }, [fetchLeads]);

  const updateLead = useCallback((lead: Lead) => {
    saveLead(lead);
    fetchLeads();
  }, [fetchLeads]);

  const removeLead = useCallback((id: string) => {
    storageDeleteLead(id);
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    isLoading,
    addLead,
    updateLead,
    deleteLead: removeLead,
    refresh: fetchLeads,
  };
}
