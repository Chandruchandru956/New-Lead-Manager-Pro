import { useState, useEffect } from "react";
import { Lead, Stage, STAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  isEditing?: boolean;
}

export function LeadForm({ initialData, onSubmit, isEditing = false }: LeadFormProps) {
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
    
    // Convert budget to number if provided
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
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Core Information</CardTitle>
          <CardDescription>Required details to get this lead into the pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Contact Name *</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Jane Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input 
              id="businessName" 
              name="businessName" 
              required 
              value={formData.businessName} 
              onChange={handleChange} 
              placeholder="e.g. Acme Corp"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service Enquired *</Label>
            <Input 
              id="service" 
              name="service" 
              required 
              value={formData.service} 
              onChange={handleChange} 
              placeholder="e.g. SEO, Web Design"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner">Lead Owner *</Label>
            <Input 
              id="owner" 
              name="owner" 
              required 
              value={formData.owner} 
              onChange={handleChange} 
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="stage">Current Stage *</Label>
            <Select value={formData.stage} onValueChange={handleStageChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
          <CardDescription>Extra context helps close deals faster.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              placeholder="e.g. Sydney"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Est. Monthly Budget ($)</Label>
            <Input 
              id="budget" 
              name="budget" 
              type="number"
              min="0"
              step="100"
              value={formData.budget} 
              onChange={handleChange} 
              placeholder="e.g. 2000"
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input 
              id="followUpDate" 
              name="followUpDate" 
              type="date"
              value={formData.followUpDate} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Any context from initial outreach..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" size="lg" className="px-8 shadow-sm">
          {isEditing ? "Save Changes" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}
