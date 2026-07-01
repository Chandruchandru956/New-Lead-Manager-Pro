import { ReactNode, useState } from "react";
import { Link, useRoute } from "wouter";
import { LayoutDashboard, UserPlus, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh] w-full bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-white">
              <LayoutDashboard size={18} />
            </div>
            LeadTracker
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close navigation menu"
            className="ml-auto text-sidebar-foreground md:hidden hover:bg-sidebar-accent hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem href="/leads/new" icon={<UserPlus size={18} />} label="Add Lead" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center gap-4 border-b bg-card px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, onClick }: { href: string; icon: ReactNode; label: string; onClick?: () => void }) {
  const [isActive] = useRoute(href);
  
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
          isActive 
            ? "bg-sidebar-primary text-sidebar-primary-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        {label}
      </div>
    </Link>
  );
}
