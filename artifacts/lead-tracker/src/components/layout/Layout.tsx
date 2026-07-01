import { ReactNode, useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  Menu,
  X,
  Kanban,
  Calendar,
  BarChart2,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDark, toggleDark } = useTheme();

  // Handle resize to auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex min-h-[100dvh] w-full bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop/Tablet */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 68 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-sidebar border-r border-sidebar-border shadow-sm text-sidebar-foreground transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-[68px]" : "w-60"
        )}
      >
        <div className={cn("flex h-16 items-center px-4 shrink-0 border-b border-sidebar-border", isCollapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <span className="font-bold text-lg">LT</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                LeadTracker
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close navigation menu"
            className="md:hidden text-sidebar-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        
        <nav className="flex flex-col gap-1.5 p-3 flex-1 overflow-y-auto">
          <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={isCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href="/pipeline" icon={<Kanban size={20} />} label="Pipeline" collapsed={isCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href="/leads/new" icon={<UserPlus size={20} />} label="Add Lead" collapsed={isCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href="/calendar" icon={<Calendar size={20} />} label="Calendar" collapsed={isCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href="/reports" icon={<BarChart2 size={20} />} label="Reports" collapsed={isCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="mt-auto flex flex-col gap-1.5 pt-4 border-t border-sidebar-border/50">
            <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" collapsed={isCollapsed} onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </nav>
        
        {/* Desktop Collapse Toggle */}
        <div className="hidden md:flex p-3 border-t border-sidebar-border justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground hover:bg-sidebar-accent/50" 
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu size={18} className={isCollapsed ? "mr-0" : "mr-2"} />
            {!isCollapsed && <span>Collapse</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden min-w-0 bg-background">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card/95 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              className="md:hidden shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <div className="hidden sm:flex text-sm text-muted-foreground font-medium items-center gap-2">
              <span className="text-foreground">{title}</span>
            </div>
          </div>

          <div className="flex-1 max-w-md px-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search leads, companies..." 
                className="w-full pl-9 rounded-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-ring"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground hidden lg:block font-medium">
              {currentDate}
            </span>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Bell size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-muted-foreground hover:text-foreground"
                onClick={toggleDark}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
            
            <div className="flex items-center gap-3 ml-2 pl-4 border-l">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">AS</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">Alex Sales</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, collapsed, onClick }: { href: string; icon: ReactNode; label: string; collapsed: boolean; onClick?: () => void }) {
  const [isActive] = useRoute(href);
  
  const itemContent = (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer relative group",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm glow-primary" 
            : "text-sidebar-foreground hover:bg-primary/10 hover:text-primary",
          collapsed && "justify-center px-0"
        )}
      >
        {isActive && !collapsed && (
          <motion.div 
            layoutId="activeNavIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        <div className={cn("shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")}>
          {icon}
        </div>
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {itemContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-semibold text-xs bg-popover border text-popover-foreground">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return itemContent;
}
