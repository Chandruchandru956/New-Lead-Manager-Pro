import { useEffect, useState } from "react";
import { Lead } from "@/lib/constants";
import { formatDate, formatRelativeDate, formatCurrency } from "@/lib/format";
import { StageBadge } from "./StageBadge";
import { LeadForm } from "./LeadForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, Trash2, Building2, User, Save, History, AlignLeft, Phone, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeadDrawerProps {
  leadId: string | null;
  leads: Lead[];
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadDrawer({ leadId, leads, onClose, onUpdate, onDelete }: LeadDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [notes, setNotes] = useState("");
  
  const lead = leads.find((l) => l.id === leadId);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      setActiveTab("details");
    }
  }, [leadId, lead]);

  if (!lead) return null;

  const handleUpdate = (data: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    onUpdate({
      ...data,
      id: lead.id,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt, // storage.ts overwrites this with current timestamp on save
    });
    toast.success("Lead updated", { description: "Changes saved successfully." });
    onClose();
  };

  const handleSaveNotes = () => {
    onUpdate({
      ...lead,
      notes,
    });
    toast.success("Notes saved");
  };

  const handleDelete = () => {
    onDelete(lead.id);
    toast.success("Lead deleted", { description: `${lead.name} has been removed.` });
    onClose();
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <Sheet open={!!leadId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 bg-background/95 backdrop-blur-xl border-l overflow-hidden">
        
        {/* Header Area */}
        <div className="p-6 pb-0 bg-card border-b shrink-0 z-10 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {lead.name} from {lead.businessName}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-start gap-4 mb-6 pt-2">
            <Avatar className="h-14 w-14 border shadow-sm shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl font-bold">{lead.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1 text-sm font-medium">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{lead.businessName}</span>
                <span className="text-muted-foreground px-1">•</span>
                <StageBadge stage={lead.stage} className="shadow-none" />
              </SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6 bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Added {formatDate(lead.createdAt)}
            </div>
            <div className="h-3 w-[1px] bg-border" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Updated {formatRelativeDate(lead.updatedAt)}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none space-x-6">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-semibold data-[state=active]:shadow-none"
              >
                <User className="h-4 w-4 mr-2" /> Details
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-semibold data-[state=active]:shadow-none"
              >
                <AlignLeft className="h-4 w-4 mr-2" /> Notes
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-semibold data-[state=active]:shadow-none"
              >
                <History className="h-4 w-4 mr-2" /> Activity
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={activeTab === "details" ? "block" : "hidden"}>
            <LeadForm initialData={lead} onSubmit={handleUpdate} isEditing />
          </div>

          <div className={activeTab === "notes" ? "block space-y-4" : "hidden"}>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Running Notes</label>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add meeting notes, context, next steps..."
                className="min-h-[300px] resize-none focus:ring-primary/20 text-sm"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes} className="gap-2 rounded-full">
                <Save className="h-4 w-4" /> Save Notes
              </Button>
            </div>
          </div>

          <div className={activeTab === "activity" ? "block" : "hidden"}>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {/* Activity Timeline Items */}
              
              {lead.followUpDate && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">Follow-up Scheduled</h4>
                      <time className="text-xs font-medium text-muted-foreground">{formatDate(lead.followUpDate)}</time>
                    </div>
                    <p className="text-xs text-muted-foreground">Action required on this date.</p>
                  </div>
                </div>
              )}

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/10 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <History className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">Record Updated</h4>
                    <time className="text-xs font-medium text-muted-foreground">{formatRelativeDate(lead.updatedAt)}</time>
                  </div>
                  <p className="text-xs text-muted-foreground">Last changes saved to pipeline.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  <User className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">Lead Created</h4>
                    <time className="text-xs font-medium text-muted-foreground">{formatDate(lead.createdAt)}</time>
                  </div>
                  <p className="text-xs text-muted-foreground">Added to {lead.stage} stage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
