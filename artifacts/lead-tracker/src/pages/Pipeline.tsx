import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLeads } from "@/hooks/useLeads";
import { STAGES, Stage, Lead } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Building2, GripVertical, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/format";
import { Link } from "wouter";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";

// Individual Card Component
function SortableCard({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: lead });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const initials = lead.owner.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "bg-card border rounded-xl p-4 shadow-sm group mb-3 cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50 ring-2 ring-primary border-primary shadow-lg" : "hover:shadow-md hover:border-primary/40 transition-shadow"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <Link href={`/leads/${lead.id}`} className="font-semibold text-[15px] hover:text-primary transition-colors z-10" onClick={e => e.stopPropagation()}>
            {lead.name}
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {lead.businessName}
          </span>
        </div>
        <div 
          className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors p-1"
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-semibold">
          {lead.service}
        </span>
        {lead.budget && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(lead.budget)}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] font-medium text-muted-foreground">{lead.owner}</span>
        </div>
      </div>
    </div>
  );
}

// Droppable Column Component
function BoardColumn({ stage, leads }: { stage: Stage; leads: Lead[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const getStageColor = (stage: Stage) => {
    switch(stage) {
      case "New": return "bg-slate-500";
      case "Contacted": return "bg-blue-500";
      case "Qualified": return "bg-violet-500";
      case "Proposal": return "bg-amber-500";
      case "Won": return "bg-emerald-500";
      case "Lost": return "bg-red-500";
      default: return "bg-primary";
    }
  };

  return (
    <div className="flex shrink-0 flex-col w-80 bg-muted/30 rounded-2xl overflow-hidden border">
      <div className="p-4 bg-card border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", getStageColor(stage))} />
          <h3 className="font-semibold text-foreground">{stage}</h3>
        </div>
        <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 overflow-y-auto min-h-[500px] transition-colors duration-150",
          isOver && "bg-primary/5 ring-2 ring-inset ring-primary/20"
        )}
      >
        <SortableContext 
          items={leads.map(l => l.id)} 
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <SortableCard key={lead.id} lead={lead} />
          ))}
          {leads.length === 0 && (
            <div className={cn(
              "h-full flex items-center justify-center border-2 border-dashed rounded-xl m-2 transition-colors",
              isOver ? "border-primary/40 bg-primary/5" : "border-muted-foreground/20"
            )}>
              <span className="text-sm text-muted-foreground font-medium py-10">Drop here</span>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function Pipeline() {
  const { leads, updateLead, isLoading } = useLeads();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [boardData, setBoardData] = useState<Record<Stage, Lead[]>>(
    STAGES.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {} as Record<Stage, Lead[]>)
  );

  // Sync board data when leads fetch
  useEffect(() => {
    const newBoard = STAGES.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {} as Record<Stage, Lead[]>);
    leads.forEach(lead => {
      if (newBoard[lead.stage]) {
        newBoard[lead.stage].push(lead);
      }
    });
    setBoardData(newBoard);
  }, [leads]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find containers
    const activeLead = leads.find(l => l.id === activeId);
    let activeContainer = activeLead?.stage;
    
    // Find target container (could be a card ID or a column ID)
    let overContainer = STAGES.includes(overId as Stage) 
      ? overId as Stage 
      : leads.find(l => l.id === overId)?.stage;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // Optimistic UI update across columns
    setBoardData((prev) => {
      const activeItems = [...prev[activeContainer!]];
      const overItems = [...prev[overContainer!]];
      
      const activeIndex = activeItems.findIndex(l => l.id === activeId);
      const [item] = activeItems.splice(activeIndex, 1);
      
      const overIndex = STAGES.includes(overId as Stage) 
        ? overItems.length + 1 
        : overItems.findIndex(l => l.id === overId);
      
      overItems.splice(overIndex, 0, { ...item, stage: overContainer as Stage });
      
      return {
        ...prev,
        [activeContainer!]: activeItems,
        [overContainer!]: overItems
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    
    const activeLead = leads.find(l => l.id === activeId);
    if (!activeLead) return;

    const overContainer = STAGES.includes(overId as Stage) 
      ? overId as Stage 
      : leads.find(l => l.id === overId)?.stage;

    if (overContainer && activeLead.stage !== overContainer) {
      // Fire actual API update
      updateLead({ ...activeLead, stage: overContainer as Stage });
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } })
  };

  return (
    <Layout title="Kanban Pipeline">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-[calc(100vh-10rem)] gap-6"
      >
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex gap-6 h-full items-start w-max px-2">
                {STAGES.map((stage) => (
                  <BoardColumn key={stage} stage={stage} leads={boardData[stage]} />
                ))}
              </div>
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
              {activeLead ? (
                <div className="w-80 opacity-90 scale-105 transition-transform rotate-2 shadow-2xl">
                  <SortableCard lead={activeLead} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </motion.div>
    </Layout>
  );
}
