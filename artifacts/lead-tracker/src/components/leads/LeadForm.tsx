import { useState, useEffect } from "react";
import { Lead, Stage, STAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

// ── FloatingInput must live OUTSIDE LeadForm so React never remounts it on re-render ──
interface FloatingInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

function FloatingInput({
  id, name, label, value, required = false, type = "text", onChange, ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 transition-all duration-200 pointer-events-none text-muted-foreground",
          active
            ? "-top-2.5 text-xs bg-card px-1 text-primary font-medium z-10"
            : "top-3 text-sm"
        )}
      >
        {label}{required && <span className="text-destructive"> *</span>}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        className={cn(
          "h-12 bg-transparent transition-all",
          focused ? "ring-2 ring-primary/20 border-primary" : "hover:border-primary/50"
        )}
        {...props}
      />
    </div>
  );
}

// ── Main form component ──────────────────────────────────────────────────────
export function LeadForm({ initialData, onSubmit, isEditing = false, isSubmitting = false }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    service: "",
    stage: "New" as Stage,
    owner: "",
    city: "",
    budget: "",
    notes: "",
    followUpDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        businessName: initialData.businessName,
        service: initialData.service,
        stage: initialData.stage,
        owner: initialData.owner,
        city: initialData.city || "",
        budget: initialData.budget ? initialData.budget.toString() : "",
        notes: initialData.notes || "",
        followUpDate: initialData.followUpDate || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, stage: value as Stage }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = formData.budget ? parseFloat(formData.budget) : undefined;
    onSubmit({
      name: formData.name,
      businessName: formData.businessName,
      service: formData.service,
      stage: formData.stage,
      owner: formData.owner,
      city: formData.city || undefined,
      budget: budgetNum,
      notes: formData.notes || undefined,
      followUpDate: formData.followUpDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <Card className="shadow-sm border-t-4 border-t-primary rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/10 pb-6 border-b">
          <CardTitle className="text-xl font-bold">Core Information</CardTitle>
          <CardDescription>Required details to get this lead into the pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 pt-6">
          <FloatingInput id="name"         name="name"         label="Contact Name"      value={formData.name}         required onChange={handleChange} />
          <FloatingInput id="businessName" name="businessName" label="Business Name"     value={formData.businessName} required onChange={handleChange} />
          <FloatingInput id="service"      name="service"      label="Service Enquired"  value={formData.service}      required onChange={handleChange} />
          <FloatingInput id="owner"        name="owner"        label="Lead Owner"        value={formData.owner}        required onChange={handleChange} />

          <div className="space-y-1.5 sm:col-span-2 relative group">
            <label className="absolute left-3 -top-2.5 text-xs bg-card px-1 text-primary font-medium z-10">
              Current Stage <span className="text-destructive">*</span>
            </label>
            <Select value={formData.stage} onValueChange={handleStageChange}>
              <SelectTrigger className="h-12 hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage} className="font-medium cursor-pointer">
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-t-4 border-t-secondary rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/10 pb-6 border-b">
          <CardTitle className="text-xl font-bold">Deal Details</CardTitle>
          <CardDescription>Extra context helps close deals faster.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 pt-6">
          <FloatingInput id="city"   name="city"   label="City Location"    value={formData.city}   onChange={handleChange} />
          <FloatingInput id="budget" name="budget" label="Est. Budget ($)"  value={formData.budget} type="number" onChange={handleChange} min="0" step="100" />

          <div className="space-y-1.5 sm:col-span-2 relative">
            <label className="absolute left-3 -top-2.5 text-xs bg-card px-1 text-primary font-medium z-10">
              Follow-up Date
            </label>
            <Input
              id="followUpDate"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
              className="h-12 hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 relative group mt-2">
            <label className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none z-10",
              formData.notes.length > 0
                ? "-top-2.5 text-xs bg-card px-1 text-primary font-medium"
                : "top-3 text-sm text-muted-foreground"
            )}>
              Notes &amp; Context
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[120px] pt-4 resize-none hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      <motion.div
        className="flex justify-end gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          type="submit"
          size="lg"
          className="px-8 rounded-full shadow-md font-semibold active:scale-95 transition-transform"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
          ) : (
            isEditing ? "Save Changes" : "Create Lead"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
