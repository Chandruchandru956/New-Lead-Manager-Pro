import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLeads } from "@/hooks/useLeads";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Phone,
  MapPin,
  User,
  Clock,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
} from "date-fns";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  date: string;           // ISO date string "YYYY-MM-DD"
  title: string;
  description?: string;
  type: "meeting" | "call" | "deadline" | "reminder" | "other";
  time?: string;          // "HH:MM" 24h
}

const EVENT_TYPES: { value: CalendarEvent["type"]; label: string; color: string; bg: string }[] = [
  { value: "meeting",  label: "Meeting",  color: "text-violet-700 dark:text-violet-300",  bg: "bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700/30" },
  { value: "call",     label: "Call",     color: "text-blue-700 dark:text-blue-300",      bg: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/30" },
  { value: "deadline", label: "Deadline", color: "text-red-700 dark:text-red-300",        bg: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700/30" },
  { value: "reminder", label: "Reminder", color: "text-amber-700 dark:text-amber-300",    bg: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/30" },
  { value: "other",    label: "Other",    color: "text-slate-700 dark:text-slate-300",    bg: "bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700/30" },
];

const EVENT_TYPE_ICONS: Record<CalendarEvent["type"], string> = {
  meeting: "👥",
  call: "📞",
  deadline: "🚨",
  reminder: "🔔",
  other: "📌",
};

// ── Storage helpers ────────────────────────────────────────────────────────
const EVENTS_KEY = "crm_calendar_events";

function loadEvents(): CalendarEvent[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

// ── Blank event form ───────────────────────────────────────────────────────
const blankForm = (): Omit<CalendarEvent, "id"> => ({
  date: "",
  title: "",
  description: "",
  type: "meeting",
  time: "",
});

// ── Main component ─────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { leads } = useLeads();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents);

  // selected day panel state
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<Omit<CalendarEvent, "id">>(blankForm());
  const [saving, setSaving] = useState(false);

  // persist events
  useEffect(() => { saveEvents(events); }, [events]);

  // calendar grid
  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // leads with follow-ups
  const followUpLeads = useMemo(() => leads.filter(l => l.followUpDate), [leads]);

  // helpers
  const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

  const eventsForDay = (date: Date) =>
    events.filter(e => e.date === dayKey(date));

  const leadsForDay = (date: Date) =>
    followUpLeads.filter(l => isSameDay(new Date(l.followUpDate!), date));

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  const typeStyle = (type: CalendarEvent["type"]) =>
    EVENT_TYPES.find(t => t.value === type)!;

  // open "add event" dialog for a specific day
  const openAddDialog = (date: Date) => {
    setEditingEvent(null);
    setForm({ ...blankForm(), date: dayKey(date) });
    setDialogOpen(true);
  };

  // open "edit event" dialog
  const openEditDialog = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setForm({ date: evt.date, title: evt.title, description: evt.description || "", type: evt.type, time: evt.time || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Event title is required"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...form, id: editingEvent.id } : e));
      toast.success("Event updated");
    } else {
      setEvents(prev => [...prev, { ...form, id: crypto.randomUUID() }]);
      toast.success("Event added to calendar");
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success("Event removed");
  };

  const totalThisMonth = useMemo(() => {
    const monthStr = format(currentDate, "yyyy-MM");
    return events.filter(e => e.date.startsWith(monthStr)).length;
  }, [events, currentDate]);

  return (
    <Layout title="Calendar">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{format(currentDate, "MMMM yyyy")}</h2>
              <p className="text-sm font-medium text-muted-foreground">
                {totalThisMonth} event{totalThisMonth !== 1 ? "s" : ""} · {followUpLeads.length} follow-up{followUpLeads.length !== 1 ? "s" : ""} this month
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => openAddDialog(new Date())}
              className="gap-2 rounded-full shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Event
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="font-semibold shadow-sm">
              Today
            </Button>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/30">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-8 w-8 hover:bg-background">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-8 w-8 hover:bg-background">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-wrap gap-3 px-1">
          {EVENT_TYPES.map(t => (
            <span key={t.value} className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", t.bg, t.color)}>
              <span>{EVENT_TYPE_ICONS[t.value]}</span>{t.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/30">
            <Phone className="h-3 w-3" /> Follow-up
          </span>
        </div>

        <div className="flex gap-6 items-start">
          {/* ── Calendar Grid ── */}
          <div className="flex-1 bg-card rounded-2xl border shadow-sm overflow-hidden min-w-0">
            <div className="grid grid-cols-7 border-b bg-muted/30 text-xs font-semibold text-muted-foreground text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="py-3 border-r last:border-r-0">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr">
              {days.map((day) => {
                const dayEvts = eventsForDay(day);
                const dayLeads = leadsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const totalItems = dayEvts.length + dayLeads.length;

                return (
                  <div
                    key={dayKey(day)}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={cn(
                      "min-h-[110px] p-2 border-r border-b [&:nth-child(7n)]:border-r-0 cursor-pointer transition-colors group",
                      !isCurrentMonth && "bg-muted/10 text-muted-foreground/40",
                      isCurrentMonth && !isSelected && "bg-background hover:bg-muted/20",
                      isSelected && "bg-primary/5 ring-2 ring-inset ring-primary/30",
                    )}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-colors",
                        isCurrentDay && "bg-primary text-primary-foreground shadow-sm",
                        !isCurrentDay && isCurrentMonth && "text-foreground group-hover:bg-muted",
                        !isCurrentDay && !isCurrentMonth && "text-muted-foreground/40",
                      )}>
                        {format(day, "d")}
                      </span>
                      <div className="flex items-center gap-1">
                        {totalItems > 0 && (
                          <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                            {totalItems}
                          </span>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); openAddDialog(day); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center"
                          title="Add event"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      {dayEvts.slice(0, 2).map(evt => {
                        const s = typeStyle(evt.type);
                        return (
                          <div
                            key={evt.id}
                            onClick={e => { e.stopPropagation(); setSelectedDay(day); openEditDialog(evt); }}
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0.5 rounded-md border truncate flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity",
                              s.bg, s.color
                            )}
                          >
                            <span>{EVENT_TYPE_ICONS[evt.type]}</span>
                            <span className="truncate">{evt.title}</span>
                          </div>
                        );
                      })}
                      {dayLeads.slice(0, dayEvts.length >= 2 ? 0 : 2 - dayEvts.length).map(lead => (
                        <div
                          key={lead.id}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border truncate flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/30"
                        >
                          <Phone className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{lead.name.split(" ")[0]}</span>
                        </div>
                      ))}
                      {totalItems > 2 && (
                        <div className="text-[9px] font-semibold text-muted-foreground pl-0.5">
                          +{totalItems - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Day Panel ── */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                key="day-panel"
                initial={{ opacity: 0, x: 24, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 300 }}
                exit={{ opacity: 0, x: 24, width: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="shrink-0 bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col"
                style={{ minWidth: 280, maxWidth: 300 }}
              >
                {/* panel header */}
                <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {format(selectedDay, "EEEE")}
                    </p>
                    <p className="text-xl font-bold">{format(selectedDay, "MMMM d, yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full text-primary hover:bg-primary/10"
                      onClick={() => openAddDialog(selectedDay)}
                      title="Add event"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setSelectedDay(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {/* Custom events */}
                  {(() => {
                    const dayEvts = eventsForDay(selectedDay);
                    return dayEvts.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Events</p>
                        {dayEvts.map(evt => {
                          const s = typeStyle(evt.type);
                          return (
                            <div key={evt.id} className={cn("p-3 rounded-xl border group relative", s.bg)}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 min-w-0">
                                  <span className="text-base shrink-0">{EVENT_TYPE_ICONS[evt.type]}</span>
                                  <div className="min-w-0">
                                    <p className={cn("font-semibold text-sm leading-tight truncate", s.color)}>{evt.title}</p>
                                    {evt.time && (
                                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" />{evt.time}
                                      </p>
                                    )}
                                    {evt.description && (
                                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{evt.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button
                                    onClick={() => openEditDialog(evt)}
                                    className="h-6 w-6 rounded-md hover:bg-white/50 dark:hover:bg-black/20 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    title="Edit"
                                  >
                                    <Tag className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(evt.id)}
                                    className="h-6 w-6 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null;
                  })()}

                  {/* Follow-ups */}
                  {(() => {
                    const dayLeads = leadsForDay(selectedDay);
                    return dayLeads.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Follow-ups</p>
                        {dayLeads.map(lead => (
                          <div key={lead.id} className="p-3 rounded-xl border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/30">
                            <div className="flex items-center gap-2.5 mb-2">
                              <Avatar className="h-8 w-8 border">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                  {getInitials(lead.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm text-blue-800 dark:text-blue-200 truncate">{lead.name}</p>
                                <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 truncate">
                                  <MapPin className="h-3 w-3 shrink-0" />{lead.businessName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{lead.owner}</span>
                              <Badge variant="outline" className="text-[10px] h-5 px-1.5">{lead.stage}</Badge>
                            </div>
                            <Button asChild size="sm" variant="outline" className="w-full h-7 text-xs font-semibold rounded-full border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30">
                              <Link href={`/leads/${lead.id}`}>View Lead →</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {/* Empty state */}
                  {eventsForDay(selectedDay).length === 0 && leadsForDay(selectedDay).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-2xl">📅</div>
                      <div>
                        <p className="font-semibold text-sm">Nothing scheduled</p>
                        <p className="text-xs text-muted-foreground mt-1">Click + to add an event for this day</p>
                      </div>
                      <Button size="sm" onClick={() => openAddDialog(selectedDay)} className="gap-1.5 rounded-full mt-1">
                        <Plus className="h-3.5 w-3.5" /> Add Event
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Add / Edit Event Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={v => !v && setDialogOpen(false)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{editingEvent ? EVENT_TYPE_ICONS[form.type] : "📅"}</span>
              {editingEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Title <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Strategy call with client"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="rounded-xl"
                autoFocus
              />
            </div>

            {/* Type + Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Type</label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as CalendarEvent["type"] }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        <span className="flex items-center gap-2">
                          <span>{EVENT_TYPE_ICONS[t.value]}</span> {t.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Time (optional)</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Notes (optional)</label>
              <Textarea
                placeholder="Any extra details..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="rounded-xl resize-none min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {editingEvent && (
              <Button
                variant="destructive"
                onClick={() => { handleDelete(editingEvent.id); setDialogOpen(false); }}
                className="mr-auto rounded-full"
              >
                <Trash2 className="h-4 w-4 mr-1.5" /> Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-full gap-2">
              {saving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {editingEvent ? "Save Changes" : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
