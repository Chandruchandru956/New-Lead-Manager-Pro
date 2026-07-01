import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLeads } from "@/hooks/useLeads";
import { STAGES } from "@/lib/constants";
import { formatCurrency, formatRelativeDate, formatDate } from "@/lib/format";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StageBadge } from "@/components/leads/StageBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, TrendingUp } from "lucide-react";

export default function Reports() {
  const { leads, isLoading } = useLeads();

  // Color mapping based on stages
  const COLORS = {
    New: "hsl(215 16% 47%)", // slate
    Contacted: "hsl(221 83% 53%)", // blue
    Qualified: "hsl(262 83% 58%)", // violet
    Proposal: "hsl(38 92% 50%)", // amber
    Won: "hsl(142 71% 45%)", // emerald
    Lost: "hsl(0 84% 60%)" // red
  };

  // 1. Pipeline Funnel & Distribution
  const stageData = useMemo(() => {
    return STAGES.map(stage => ({
      name: stage,
      count: leads.filter(l => l.stage === stage).length,
      fill: COLORS[stage as keyof typeof COLORS]
    }));
  }, [leads]);

  // 2. Budget by Stage
  const budgetData = useMemo(() => {
    return STAGES.map(stage => ({
      name: stage,
      value: leads
        .filter(l => l.stage === stage && l.budget)
        .reduce((sum, l) => sum + (l.budget || 0), 0),
      fill: COLORS[stage as keyof typeof COLORS]
    })).filter(d => d.value > 0);
  }, [leads]);

  // 3. Fake monthly trend data for Area chart
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, i) => ({
      name: month,
      leads: Math.floor(Math.random() * 30) + 10 + (i * 5),
      won: Math.floor(Math.random() * 10) + 2 + (i * 2)
    }));
  }, []);

  // Upcoming follow ups
  const upcomingLeads = useMemo(() => {
    const now = new Date();
    return leads
      .filter(l => l.followUpDate && new Date(l.followUpDate) >= now)
      .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime())
      .slice(0, 5);
  }, [leads]);

  // Recent activity
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [leads]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg shadow-md p-3 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold">{formatter ? formatter(entry.value) : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Layout title="Reports"><div className="flex-1 flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div></Layout>;
  }

  return (
    <Layout title="Analytics & Reports">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 pb-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Trend */}
          <Card className="shadow-sm border-t-4 border-t-primary rounded-2xl lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Lead Velocity Trend</CardTitle>
              <CardDescription>New leads vs converted deals over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(240 82% 62%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(240 82% 62%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                    <Area type="monotone" name="Total Leads" dataKey="leads" stroke="hsl(240 82% 62%)" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    <Area type="monotone" name="Won Deals" dataKey="won" stroke="hsl(142 71% 45%)" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Funnel */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pipeline Funnel</CardTitle>
              <CardDescription>Current leads by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} width={80} />
                    <RechartsTooltip cursor={{fill: 'var(--muted)', opacity: 0.4}} content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Leads" radius={[0, 4, 4, 0]} barSize={24}>
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Analysis */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pipeline Value</CardTitle>
              <CardDescription>Total estimated budget by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip formatter={(val: number) => formatCurrency(val)} />} />
                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Actions */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Upcoming Follow-ups</CardTitle>
                  <CardDescription>Next 5 scheduled actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {upcomingLeads.length > 0 ? upcomingLeads.map(lead => (
                  <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{getInitials(lead.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.businessName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatDate(lead.followUpDate)}</p>
                      <StageBadge stage={lead.stage} className="mt-1" />
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">No upcoming follow-ups.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>Last updated deals</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentLeads.map(lead => (
                  <div key={`recent-${lead.id}`} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">{lead.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatRelativeDate(lead.updatedAt)}</span>
                        <span className="text-muted-foreground text-[10px]">•</span>
                        <span className="text-xs font-medium text-foreground">{lead.owner}</span>
                      </div>
                    </div>
                    <StageBadge stage={lead.stage} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </motion.div>
    </Layout>
  );
}
