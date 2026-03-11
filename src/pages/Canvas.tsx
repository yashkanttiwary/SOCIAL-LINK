import { useState, useRef, useEffect, PointerEvent, MouseEvent } from 'react';
import { MousePointer2, StickyNote, PenTool, Square, Type, GitMerge, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAIPanelStore } from '../store/aiPanelStore';

const initialNotes = [
  { id: 1, text: 'Hook idea: Start with the messy desk', color: 'bg-yellow-200 text-yellow-900', x: 200, y: 150, r: -3 },
  { id: 2, text: 'Thumbnail: Split screen Before/After', color: 'bg-green-200 text-green-900', x: 500, y: 100, r: 2 },
  { id: 3, text: 'Sponsor integration at 3:00', color: 'bg-blue-200 text-blue-900', x: 350, y: 350, r: -1 },
  { id: 4, text: 'B-roll: Typing close up', color: 'bg-pink-200 text-pink-900', x: 700, y: 250, r: 4 },
];

export function Canvas() {
  const { openPanel } = useAIPanelStore();
  const [notes, setNotes] = useState(initialNotes);
  const [activeTool, setActiveTool] = useState('cursor');
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent, id: number) => {
    if (activeTool !== 'cursor') return;
    setDraggingId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (draggingId === null) return;
    
    setNotes(notes.map(note => {
      if (note.id === draggingId) {
        return {
          ...note,
          x: note.x + e.movementX,
          y: note.y + e.movementY
        };
      }
      return note;
    }));
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (draggingId !== null) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggingId(null);
    }
  };

  const addNote = (e: MouseEvent) => {
    if (activeTool !== 'sticky') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - 100; // Center note on click
    const y = e.clientY - rect.top - 100;
    
    const colors = [
      'bg-yellow-200 text-yellow-900',
      'bg-green-200 text-green-900',
      'bg-blue-200 text-blue-900',
      'bg-pink-200 text-pink-900',
      'bg-purple-200 text-purple-900'
    ];
    
    setNotes([...notes, {
      id: Date.now(),
      text: 'New Note',
      color: colors[Math.floor(Math.random() * colors.length)],
      x,
      y,
      r: Math.random() * 10 - 5
    }]);
    
    setActiveTool('cursor');
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-base" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      {/* Toolbar */}
      <div className="absolute top-6 left-6 bg-bg-surface/80 backdrop-blur-md border border-border rounded-2xl p-2 shadow-lg flex flex-col gap-2 z-20">
        {[
          { id: 'cursor', icon: MousePointer2 },
          { id: 'sticky', icon: StickyNote },
          { id: 'draw', icon: PenTool },
          { id: 'shape', icon: Square },
          { id: 'text', icon: Type },
          { id: 'connector', icon: GitMerge },
        ].map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "p-3 rounded-xl transition-colors",
              activeTool === tool.id ? "bg-primary text-white shadow-md" : "text-text-2 hover:bg-bg-elevated hover:text-text-1"
            )}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Theme Card */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-bg-surface border-2 border-primary rounded-2xl px-8 py-4 shadow-lg z-10">
        <h2 className="font-black text-xl text-text-1 tracking-widest uppercase">Core Theme: Sustainable Tech</h2>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="w-full h-full relative cursor-crosshair"
        onClick={addNote}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* SVG Connectors (Mock) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <path d="M 300 250 Q 400 200 500 200" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 450 450 Q 550 400 700 350" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Sticky Notes */}
        {notes.map(note => (
          <div
            key={note.id}
            onPointerDown={(e) => handlePointerDown(e, note.id)}
            className={cn(
              "absolute w-48 h-48 rounded-xl p-4 shadow-lg cursor-grab active:cursor-grabbing transition-shadow",
              note.color,
              draggingId === note.id ? "shadow-2xl z-50 scale-105" : "z-10 hover:shadow-xl"
            )}
            style={{ 
              transform: `translate(${note.x}px, ${note.y}px) rotate(${note.r}deg)`,
              touchAction: 'none'
            }}
          >
            <textarea
              className="w-full h-full bg-transparent border-none resize-none focus:outline-none font-medium text-sm"
              defaultValue={note.text}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px] font-bold opacity-50">
              <span>Alex</span>
              <span>10:42 AM</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Panel (Persistent on Canvas) */}
      <div className="absolute bottom-6 right-6 w-80 bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-20 flex flex-col">
        <div className="bg-bg-elevated p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-text-1">Fusion AI Assistant</h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-success uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            Online
          </span>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-primary-muted/30 border border-primary/20 rounded-xl p-4 relative">
            <div className="absolute -left-1.5 top-4 w-3 h-3 bg-bg-surface border border-primary/20 rotate-45"></div>
            <p className="text-sm text-text-1 italic leading-relaxed">
              "I found trending topics related to your 'Sustainable Tech' idea. Interest in biophilic hardware has risen 40% in Western Europe."
            </p>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm">
            Add to Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
