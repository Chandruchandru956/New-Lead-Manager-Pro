import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/leads/LeadForm";
import { useLeads } from "@/hooks/useLeads";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { formatDate, formatRelativeDate } from "@/lib/format";
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
import { StageBadge } from "@/components/leads/StageBadge";

export default function LeadDetail() {
  const params = useParams();
  const id = params.id as string;
  const { leads, isLoading, updateLead, deleteLead } = useLeads();
  const [, setLocation] = useLocation();

  const lead = leads.find((l) => l.id === id);

  if (isLoading) {
    return (
      <Layout title="Lead Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground">Loading lead data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!lead) {
    return (
      <Layout title="Lead Not Found">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Lead not found</h2>
          <p className="text-muted-foreground mb-6">The lead you're looking for doesn't exist or was deleted.</p>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (data: any) => {
    updateLead({
      ...data,
      id: lead.id,
      createdAt: lead.createdAt,
      // updatedAt is handled by storage.ts
    });
    setLocation("/");
  };

  const handleDelete = () => {
    deleteLead(lead.id);
    setLocation("/");
  };

  return (
    <Layout title={`Edit: ${lead.name}`}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full shrink-0">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{lead.businessName}</h2>
                <StageBadge stage={lead.stage} />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" /> Created {formatDate(lead.createdAt)}
                <span className="text-border mx-1">|</span>
                <Clock className="h-3 w-3" /> Updated {formatRelativeDate(lead.updatedAt)}
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2 self-start sm:self-auto">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete Lead</span>
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

        <LeadForm 
          initialData={lead} 
          onSubmit={handleSubmit} 
          isEditing 
        />
      </div>
    </Layout>
  );
}
