import { Lead, DUMMY_LEADS } from "./constants";

const STORAGE_KEY = "crm_leads";

export function getLeads(): Lead[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed on first load — always return from storage, never the shared constant
      seedLeads();
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Lead[];
    }
    return JSON.parse(data) as Lead[];
  } catch (error) {
    console.error("Failed to parse leads from local storage", error);
    return [];
  }
}

export function saveLead(lead: Lead): void {
  const leads = getLeads();
  const existingIndex = leads.findIndex((l) => l.id === lead.id);
  
  const now = new Date().toISOString();
  const leadToSave = {
    ...lead,
    updatedAt: now,
    createdAt: lead.createdAt || now,
  };

  if (existingIndex >= 0) {
    leads[existingIndex] = leadToSave;
  } else {
    leads.unshift(leadToSave);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function deleteLead(id: string): void {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

function seedLeads() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_LEADS));
}
