'use client';
import { useMatterStore, Screen } from '@/lib/store';
import { Home, Sparkles, MessageSquare, User } from 'lucide-react';

const tabs: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home',    label: 'Descargar', icon: Home },
  { id: 'space',   label: 'Tu Espacio', icon: Sparkles },
  { id: 'debrief', label: 'Debrief', icon: MessageSquare },
  { id: 'profile', label: 'Reflejo', icon: User },
];

export function BottomNav() {
  const { screen, setScreen, triageLevel } = useMatterStore();

  const activeColor = triageLevel === 'yellow'
    ? '#6C63FF'
    : triageLevel === 'green'
    ? '#FF8C00'
    : '#4CAF50';

  const isDark = triageLevel === 'yellow';

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-safe
        ${isDark ? 'bg-[rgba(13,13,26,0.92)]' : 'bg-[rgba(255,255,255,0.85)]'}
        backdrop-blur-2xl border-t
        ${isDark ? 'border-[rgba(108,99,255,0.2)]' : 'border-[rgba(0,0,0,0.06)]'}`}
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = screen === id;
        return (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className="flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all duration-200 active:scale-95"
          >
            <Icon
              size={22}
              style={{ color: active ? activeColor : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)' }}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span
              className="text-[10px] font-medium tracking-wide"
              style={{ color: active ? activeColor : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
