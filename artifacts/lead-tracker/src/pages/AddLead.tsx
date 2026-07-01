import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/leads/LeadForm";
import { useLeads } from "@/hooks/useLeads";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function AddLead() {
  const { addLead } = useLeads();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    // Simulate network delay for UX
    setTimeout(() => {
      addLead(data);
      toast.success("Lead created successfully", {
        description: `${data.name} from ${data.businessName} has been added to your pipeline.`
      });
      setLocation("/"); 
    }, 600);
  };

  return (
    <Layout title="Add New Lead">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto py-6"
      >
        <div className="mb-8 flex items-center gap-5">
          <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/80 shadow-sm border-muted transition-transform active:scale-95 shrink-0">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">New Opportunity</h2>
            <p className="text-muted-foreground font-medium mt-1">Fill in the details to track this prospect.</p>
          </div>
        </div>

        <LeadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </motion.div>
    </Layout>
  );
}
