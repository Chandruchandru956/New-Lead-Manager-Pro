import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLeads } from "@/hooks/useLeads";
import { Lead } from "@/lib/constants";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Link } from "wouter";

export default function CalendarPage() {
  const { leads } = useLeads();
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    // Get start day of week to pad start (0 = Sunday, 1 = Monday)
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Get end day of week to pad end
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const leadsWithFollowUps = useMemo(() => {
    return leads.filter(l => l.followUpDate);
  }, [leads]);

  const getLeadsForDay = (date: Date) => {
    return leadsWithFollowUps.filter(l => {
      const followUp = new Date(l.followUpDate!);
      return isSameDay(followUp, date);
    });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <Layout title="Calendar">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{format(currentDate, "MMMM yyyy")}</h2>
              <p className="text-sm font-medium text-muted-foreground">
                {leadsWithFollowUps.length} upcoming follow-ups scheduled
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToToday} className="font-semibold shadow-sm">
              Today
            </Button>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-muted/30">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 hover:bg-background">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 hover:bg-background">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b bg-muted/30 text-xs font-semibold text-muted-foreground text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 border-r last:border-r-0">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-fr">
            {days.map((day, i) => {
              const dayLeads = getLeadsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              
              return (
                <div 
                  key={day.toISOString()} 
                  className={`min-h-[120px] p-2 border-r border-b [&:nth-child(7n)]:border-r-0 transition-colors ${
                    !isCurrentMonth ? 'bg-muted/10 text-muted-foreground/50' : 'bg-background hover:bg-muted/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                      isCurrentDay 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-foreground'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {dayLeads.length > 0 && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {dayLeads.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    {dayLeads.slice(0, 3).map((lead, j) => (
                      <Popover key={`${lead.id}-${j}`}>
                        <PopoverTrigger asChild>
                          <div className="flex items-center gap-1.5 p-1.5 text-xs rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span className="truncate font-semibold">{lead.name.split(' ')[0]}</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0 rounded-xl overflow-hidden shadow-lg border">
                          <div className="p-4 bg-muted/30 border-b flex items-start gap-3">
                            <Avatar className="h-10 w-10 border shadow-sm">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(lead.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-sm leading-tight">{lead.name}</h4>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" /> {lead.businessName}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 bg-card flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-medium">Owner</span>
                              <span className="font-semibold flex items-center gap-1"><User className="h-3 w-3"/> {lead.owner}</span>
                            </div>
                            <Button asChild size="sm" className="w-full mt-2 rounded-full h-8 text-xs font-semibold">
                              <Link href={`/leads/${lead.id}`}>View Lead</Link>
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                    {dayLeads.length > 3 && (
                      <div className="text-[10px] font-semibold text-muted-foreground pl-1 mt-1">
                        + {dayLeads.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
