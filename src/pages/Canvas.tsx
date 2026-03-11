import { useMemo, useRef, useState, type PointerEvent, type MouseEvent } from 'react';
import { MousePointer2, StickyNote, Type, GitMerge, Sparkles, Trash2, Link2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDataStore } from '../store/dataStore';

const colors = ['bg-yellow-200 text-yellow-900', 'bg-green-200 text-green-900', 'bg-blue-200 text-blue-900', 'bg-pink-200 text-pink-900', 'bg-purple-200 text-purple-900'];

type Tool = 'cursor' | 'sticky' | 'text' | 'connector';

export function Canvas() {
  const {
    canvasItems,
    canvasConnections,
    report,
    addCanvasItem,
    updateCanvasItem,
    removeCanvasItem,
    addCanvasConnection,
    addTopicToCanvas,
  } = useDataStore();
  const [activeTool, setActiveTool] = useState<Tool>('cursor');
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [connectorStart, setConnectorStart] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const itemMap = useMemo(() => new Map(canvasItems.map((item) => [item.id, item])), [canvasItems]);

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (activeTool !== 'sticky' && activeTool !== 'text') return;
    const x = e.clientX - rect.left - 90;
    const y = e.clientY - rect.top - 80;
    const kind = activeTool === 'sticky' ? 'sticky' : 'text';
    addCanvasItem({
      text: kind === 'sticky' ? 'New sticky note' : 'New text block',
      kind,
      color: kind === 'sticky' ? colors[Math.floor(Math.random() * colors.length)] : 'text-text-1',
      x,
      y,
      r: kind === 'sticky' ? Math.random() * 8 - 4 : 0,
    });
    setActiveTool('cursor');
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>, id: number) => {
    e.stopPropagation();
    setSelectedId(id);

    if (activeTool === 'connector') {
      if (!connectorStart) setConnectorStart(id);
      else {
        addCanvasConnection(connectorStart, id);
        setConnectorStart(null);
      }
      return;
    }

    if (activeTool !== 'cursor') return;
    setDraggingId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    const item = itemMap.get(draggingId);
    if (!item) return;
    updateCanvasItem(draggingId, { x: item.x + e.movementX, y: item.y + e.movementY });
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDraggingId(null);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-base" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      <div className="absolute top-5 left-5 bg-bg-surface/95 border border-border rounded-2xl p-2 shadow-xl flex flex-col gap-2 z-20">
        {[
          { id: 'cursor', icon: MousePointer2, label: 'Move' },
          { id: 'sticky', icon: StickyNote, label: 'Sticky' },
          { id: 'text', icon: Type, label: 'Text' },
          { id: 'connector', icon: GitMerge, label: 'Link' },
        ].map((tool) => (
          <button key={tool.id} onClick={() => setActiveTool(tool.id as Tool)} title={tool.label} className={cn('p-3 rounded-xl transition-colors', activeTool === tool.id ? 'bg-primary text-white shadow-md' : 'text-text-2 hover:bg-bg-elevated hover:text-text-1')}>
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-bg-surface/95 border border-border rounded-xl px-5 py-3 shadow-lg z-20">
        <p className="text-xs text-text-3 uppercase">Focus Topic</p>
        <h2 className="font-black text-text-1">{report.topic}</h2>
      </div>

      <div
        ref={canvasRef}
        className={cn('w-full h-full relative', activeTool === 'sticky' || activeTool === 'text' ? 'cursor-copy' : 'cursor-default')}
        onClick={handleCanvasClick}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {canvasConnections.map((c) => {
            const from = itemMap.get(c.fromId);
            const to = itemMap.get(c.toId);
            if (!from || !to) return null;
            return <path key={c.id} d={`M ${from.x + 90} ${from.y + 70} C ${from.x + 150} ${from.y + 70}, ${to.x + 30} ${to.y + 70}, ${to.x + 90} ${to.y + 70}`} fill="none" stroke="var(--primary)" strokeOpacity="0.5" strokeWidth="2" />;
          })}
        </svg>

        {canvasItems.map((item) => (
          <div
            key={item.id}
            onPointerDown={(e) => onPointerDown(e, item.id)}
            className={cn(
              'absolute rounded-xl p-3 shadow-lg border border-black/5 transition-all',
              item.kind === 'sticky' ? 'w-44 min-h-36' : 'w-60 min-h-24 bg-bg-surface border-border',
              item.color,
              selectedId === item.id ? 'ring-2 ring-primary z-40' : 'z-10',
            )}
            style={{ transform: `translate(${item.x}px, ${item.y}px) rotate(${item.r}deg)`, touchAction: 'none' }}
          >
            <textarea
              value={item.text}
              onChange={(e) => updateCanvasItem(item.id, { text: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className={cn('w-full min-h-20 bg-transparent border-none resize-none focus:outline-none text-sm', item.kind === 'text' ? 'text-text-1' : 'font-medium')}
            />
            {selectedId === item.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCanvasItem(item.id);
                  setSelectedId(null);
                }}
                className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-danger text-white flex items-center justify-center"
                aria-label="Delete canvas item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 w-84 max-w-[90vw] bg-bg-surface border border-border rounded-2xl shadow-2xl z-20">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><h3 className="font-bold text-sm">AI Canvas Copilot</h3></div>
          <span className="text-[10px] font-bold text-success">LIVE</span>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <p className="text-text-2">Top signals: {report.emergingTopics.slice(0, 2).join(', ')}</p>
          <button onClick={addTopicToCanvas} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg">Add AI topic card</button>
          <button onClick={() => setActiveTool('connector')} className="w-full border border-primary text-primary font-bold py-2.5 rounded-lg flex items-center justify-center gap-2"><Link2 className="w-4 h-4" /> Connect two notes</button>
          {connectorStart && <p className="text-xs text-text-3">Select a second note to complete the connector.</p>}
        </div>
      </div>
    </div>
  );
}
