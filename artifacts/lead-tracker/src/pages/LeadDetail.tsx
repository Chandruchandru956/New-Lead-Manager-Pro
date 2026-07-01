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
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function LeadDetail() {
  const params = useParams();
  const id = params.id as string;
  const { leads, isLoading, updateLead, deleteLead } = useLeads();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lead = leads.find((l) => l.id === id);

  if (isLoading) {
    return (
      <Layout title="Lead Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground font-medium">Loading lead data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!lead) {
    return (
      <Layout title="Lead Not Found">
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Trash2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">Lead not found</h2>
          <p className="text-muted-foreground mb-8">The lead you're looking for doesn't exist or was deleted.</p>
          <Link href="/">
            <Button className="rounded-full px-8">Return to Pipeline</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateLead({
        ...data,
        id: lead.id,
        createdAt: lead.createdAt,
      });
      toast.success("Lead updated successfully");
      setLocation("/");
    }, 400);
  };

  const handleDelete = () => {
    deleteLead(lead.id);
    toast.success("Lead deleted");
    setLocation("/");
  };

  return (
    <Layout title={`Edit: ${lead.name}`}>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto py-6"
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-start gap-4">
            <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-full shrink-0 hover:bg-muted/80 mt-1">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{lead.businessName}</h2>
                <StageBadge stage={lead.stage} />
              </div>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium mt-3 bg-muted/50 py-1.5 px-3 rounded-md w-fit">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Added {formatDate(lead.createdAt)}
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Updated {formatRelativeDate(lead.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2 self-start sm:self-auto text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline font-semibold">Delete Lead</span>
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
          isSubmitting={isSubmitting}
        />
      </motion.div>
    </Layout>
  );
}
