import { Layout } from "@/components/layout/Layout";
import { LeadForm } from "@/components/leads/LeadForm";
import { useLeads } from "@/hooks/useLeads";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AddLead() {
  const { addLead } = useLeads();
  const [, setLocation] = useLocation();

  const handleSubmit = (data: any) => {
    addLead(data);
    setLocation("/"); // Go back to dashboard on success
  };

  return (
    <Layout title="Add New Lead">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Lead Information</h2>
            <p className="text-sm text-muted-foreground">Fill in the details to track this prospect.</p>
          </div>
        </div>

        <LeadForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
}
