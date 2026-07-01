import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useTheme } from "@/contexts/ThemeContext";
import { useLeads } from "@/hooks/useLeads";
import { getLeads } from "@/lib/storage";
import { motion } from "framer-motion";
import { Switch as UISwitch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Bell, Moon, Sun, Download, Trash2, ShieldAlert, User, Laptop, Pencil, Loader2 } from "lucide-react";
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

// ── Profile stored in localStorage ──────────────────────────────────────────
const PROFILE_KEY = "crm_profile";

interface Profile {
  name: string;
  role: string;
  email: string;
}

const DEFAULT_PROFILE: Profile = {
  name: "Chandru Sales",
  role: "Sales Manager",
  email: "chandru@acmecorp.com",
};

function loadProfile(): Profile {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}") };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Settings() {
  const { isDark, toggleDark } = useTheme();
  const { deleteLead, refresh } = useLeads();

  // Profile state
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);

  // Keep form in sync when dialog opens
  useEffect(() => {
    if (editOpen) setEditForm(profile);
  }, [editOpen, profile]);

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    saveProfile(editForm);
    setProfile(editForm);
    setSaving(false);
    setEditOpen(false);
    toast.success("Profile updated", { description: "Your changes have been saved." });
  };

  // CSV export
  const handleExportCSV = () => {
    try {
      const leads = getLeads();
      const headers = ["Name", "Business", "Service", "Stage", "Owner", "City", "Budget", "Notes", "Follow-up", "Created", "Updated"];
      const rows = leads.map((l) => [
        l.name, l.businessName, l.service, l.stage, l.owner,
        l.city || "", l.budget || "",
        l.notes ? l.notes.replace(/\n/g, " ") : "",
        l.followUpDate || "", l.createdAt, l.updatedAt,
      ]);
      const csv = [headers, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Export successful", { description: `${leads.length} leads exported to CSV.` });
    } catch {
      toast.error("Export failed", { description: "An error occurred while generating the CSV." });
    }
  };

  // Clear all data
  const handleClearData = () => {
    const leads = getLeads();
    leads.forEach((l) => deleteLead(l.id));
    refresh();
    toast.success("Data cleared", { description: "All leads have been permanently deleted." });
  };

  return (
    <Layout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto flex flex-col gap-8 pb-10"
      >
        {/* ── Profile ── */}
        <Card className="rounded-2xl shadow-sm border-t-4 border-t-primary overflow-hidden">
          <CardHeader className="bg-muted/10 border-b pb-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Settings
            </CardTitle>
            <CardDescription>Manage your account identity and display name.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{profile.name}</h3>
                <p className="text-sm font-medium text-muted-foreground bg-muted inline-flex px-2 py-0.5 rounded-md">
                  {profile.role}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
              </div>
              <Button
                variant="outline"
                className="font-semibold shadow-sm shrink-0 gap-2"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ── Appearance ── */}
          <Card className="rounded-2xl shadow-sm h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Laptop className="h-5 w-5 text-muted-foreground" /> Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                </div>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-full border">
                  <button
                    onClick={() => isDark && toggleDark()}
                    className={`p-2 rounded-full transition-all ${!isDark ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => !isDark && toggleDark()}
                    className={`p-2 rounded-full transition-all ${isDark ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-3 block">Accent Color</Label>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 ring-2 ring-indigo-500 ring-offset-2 ring-offset-background shadow-sm cursor-pointer transition-transform hover:scale-110" />
                  <div className="h-8 w-8 rounded-full bg-blue-500 shadow-sm cursor-pointer transition-transform hover:scale-110 opacity-50 hover:opacity-100" />
                  <div className="h-8 w-8 rounded-full bg-emerald-500 shadow-sm cursor-pointer transition-transform hover:scale-110 opacity-50 hover:opacity-100" />
                  <div className="h-8 w-8 rounded-full bg-violet-500 shadow-sm cursor-pointer transition-transform hover:scale-110 opacity-50 hover:opacity-100" />
                  <div className="h-8 w-8 rounded-full bg-rose-500 shadow-sm cursor-pointer transition-transform hover:scale-110 opacity-50 hover:opacity-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Notifications ── */}
          <Card className="rounded-2xl shadow-sm h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive daily summaries.</p>
                </div>
                <UISwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Desktop Notifications</Label>
                  <p className="text-xs text-muted-foreground">In-app push notifications.</p>
                </div>
                <UISwitch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Follow-up Reminders</Label>
                  <p className="text-xs text-muted-foreground">Alerts for upcoming scheduled tasks.</p>
                </div>
                <UISwitch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Data Management ── */}
        <Card className="rounded-2xl shadow-sm border-destructive/20 overflow-hidden">
          <CardHeader className="bg-destructive/5 pb-4 border-b border-destructive/10">
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" /> Data Management
            </CardTitle>
            <CardDescription>Export your data or permanently delete all CRM records.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Export Pipeline Data</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Download all your leads, notes, and stages as a CSV file for backup or analysis.
                </p>
              </div>
              <Button onClick={handleExportCSV} variant="outline" className="gap-2 shadow-sm font-semibold shrink-0">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-destructive">Danger Zone</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Permanently delete all leads and CRM data. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2 shadow-sm font-semibold shrink-0">
                    <Trash2 className="h-4 w-4" /> Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" /> Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all leads, notes, and pipeline data from your local storage.
                      You cannot undo this action. Are you absolutely sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearData}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground font-medium">LeadTracker v1.0.0</p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">Built with React, Tailwind CSS &amp; Framer Motion</p>
        </div>
      </motion.div>

      {/* ── Edit Profile Dialog ── */}
      <Dialog open={editOpen} onOpenChange={(v) => !saving && setEditOpen(v)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" /> Edit Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Avatar preview */}
            <div className="flex justify-center">
              <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {getInitials(editForm.name || "?")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-sm font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="profile-name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-role" className="text-sm font-semibold">Role / Title</Label>
              <Input
                id="profile-role"
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Sales Manager"
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email" className="text-sm font-semibold">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
                className="rounded-xl h-11"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving} className="rounded-full gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
