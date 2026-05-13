'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Flame, Archive, Brain, X } from 'lucide-react';
import { useMatterStore, Bubble } from '@/lib/store';
import { emotionColors } from '@/lib/colors';
import { GlassCard } from '@/components/ui/GlassCard';

function BubbleCell({ bubble, onFocus }: { bubble: Bubble; onFocus: (id: string) => void }) {
  const color = emotionColors[bubble.emotion];
  const size = 64 + bubble.intensity * 80;
  const delay = parseFloat(bubble.id) % 3;

  return (
    <motion.button
      className="absolute rounded-full flex items-center justify-center text-center cursor-pointer select-none"
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color.secondary}CC, ${color.primary}AA)`,
        border: `1.5px solid ${color.secondary}80`,
        boxShadow: bubble.frozen
          ? `0 0 0 2px #4A90D990, inset 0 0 20px rgba(255,255,255,0.1)`
          : `0 4px 24px ${color.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
        backdropFilter: 'blur(8px)',
        opacity: bubble.frozen ? 0.6 : 1,
        transform: 'translate(-50%, -50%)',
      }}
      animate={!bubble.frozen ? {
        y: [0, -8, 4, -5, 0],
        x: [0, 3, -2, 4, 0],
        scale: [1, 1.03, 0.98, 1.02, 1],
      } : {}}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay * 0.5,
      }}
      onTap={() => onFocus(bubble.id)}
      whileTap={{ scale: 0.94 }}
    >
      {bubble.frozen && (
        <div className="absolute inset-0 rounded-full bg-blue-200/20 backdrop-blur-sm" />
      )}
      <span
        className="px-2 text-white font-medium leading-tight"
        style={{ fontSize: Math.max(9, 12 - bubble.text.length * 0.08) }}
      >
        {bubble.text.length > 30 ? bubble.text.slice(0, 28) + '…' : bubble.text}
      </span>
    </motion.button>
  );
}

function FocusModal({ bubble, onClose }: { bubble: Bubble; onClose: () => void }) {
  const { popBubble, freezeBubble, setScreen } = useMatterStore();
  const color = emotionColors[bubble.emotion];
  const [dragDir, setDragDir] = useState<'up' | 'down' | null>(null);
  const [popped, setPopped] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string }[]>([]);

  const triggerPop = () => {
    const particles = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: [color.primary, color.secondary, '#fff', '#FFD966'][Math.floor(Math.random() * 4)],
    }));
    setConfetti(particles);
    setPopped(true);
    setTimeout(() => { popBubble(bubble.id); onClose(); }, 900);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -60) { setDragDir('up'); setTimeout(triggerPop, 200); }
    else if (info.offset.y > 60) { setDragDir('down'); setTimeout(() => { freezeBubble(bubble.id); onClose(); }, 300); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      <AnimatePresence>
        {confetti.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ background: p.color, left: `${p.x}%`, top: '50%' }}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -200 - Math.random() * 200, x: (Math.random() - 0.5) * 300, opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Bubble drag target */}
      <div className="flex flex-col items-center gap-6 px-6 w-full max-w-sm">
        {/* Swipe up hint */}
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ opacity: dragDir === 'up' ? 1 : 0.5, y: dragDir === 'up' ? -4 : 0 }}
        >
          <Flame size={20} color={color.primary} />
          <span className="text-xs text-white/70 font-medium">Swipe up para explotar</span>
        </motion.div>

        {/* Draggable bubble */}
        <motion.div
          className="relative rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            width: 160,
            height: 160,
            background: `radial-gradient(circle at 35% 35%, ${color.secondary}DD, ${color.primary}BB)`,
            border: `2px solid ${color.secondary}80`,
            boxShadow: `0 8px 48px ${color.glow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
          }}
          drag="y"
          dragConstraints={{ top: -120, bottom: 120 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          animate={popped ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : {}}
          transition={popped ? { duration: 0.4 } : {}}
          whileTap={{ scale: 0.96 }}
        >
          <p className="text-white text-sm font-semibold text-center px-4 leading-snug">
            {bubble.text}
          </p>
        </motion.div>

        {/* Swipe down hint */}
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={{ opacity: dragDir === 'down' ? 1 : 0.5, y: dragDir === 'down' ? 4 : 0 }}
        >
          <Archive size={20} color="#7BB8F0" />
          <span className="text-xs text-white/70 font-medium">Swipe down para congelar</span>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={triggerPop}
            className="flex-1 py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})` }}
          >
            <Flame size={16} /> POP!
          </button>
          <button
            onClick={() => { setScreen('debrief'); onClose(); }}
            className="flex-1 py-3 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: 'rgba(0,210,200,0.25)', border: '1px solid rgba(0,210,200,0.4)' }}
          >
            <Brain size={16} /> Re-Frame
          </button>
        </div>

        <button onClick={onClose} className="text-white/40 text-xs flex items-center gap-1 hover:text-white/70 transition-colors">
          <X size={14} /> Cancelar
        </button>
      </div>
    </motion.div>
  );
}

export function SpaceScreen() {
  const { bubbles, triageLevel, focusedBubble, setFocusedBubble, setScreen, setDebriefOpen } = useMatterStore();
  const isDark = triageLevel === 'yellow';
  const focusedBubbleData = bubbles.find((b) => b.id === focusedBubble);

  const dominantEmotion = bubbles.length > 0
    ? emotionColors[bubbles[bubbles.length - 1].emotion]
    : emotionColors.frustration;

  const density = Math.min(bubbles.length / 10, 1);

  return (
    <div
      className="min-h-screen relative overflow-hidden pb-24"
      style={{
        background: isDark
          ? `radial-gradient(ellipse at 50% 50%, ${dominantEmotion.primary}18 0%, #0D0D1A 70%)`
          : `radial-gradient(ellipse at 50% 50%, ${dominantEmotion.primary}12 0%, #F8F7FF 70%)`,
      }}
    >
      {/* Header */}
      <div className="pt-16 px-5 pb-4">
        <h2
          className="text-2xl font-extrabold"
          style={{ color: isDark ? '#F0F0FF' : '#1A1A2E' }}
        >
          Tu Espacio
        </h2>
        <p className={`text-sm ${isDark ? 'text-white/40' : 'text-black/35'}`}>
          {bubbles.length === 0 ? 'Tu espacio está limpio ✨' : `${bubbles.length} burbuja${bubbles.length !== 1 ? 's' : ''} flotando`}
        </p>
      </div>

      {/* Bubble canvas */}
      <div className="relative mx-4 rounded-3xl overflow-hidden" style={{ height: '55vh' }}>
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: isDark
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.4)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`,
            backdropFilter: 'blur(8px)',
          }}
        />

        {bubbles.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-5xl"
            >
              🫧
            </motion.div>
            <p className={`text-sm ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              Descarga algo para verlo aquí
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="absolute"
                style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
              >
                <BubbleCell bubble={bubble} onFocus={setFocusedBubble} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Density bar */}
      <div className="mx-4 mt-4 mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/30'}`}>
            Densidad Acumulada
          </span>
          <span className="text-xs font-bold" style={{ color: dominantEmotion.primary }}>
            {Math.round(density * 100)}%
          </span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/08'}`} style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${dominantEmotion.primary}, ${dominantEmotion.secondary})` }}
            animate={{ width: `${density * 100}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 14 }}
          />
        </div>
      </div>

      {/* Debrief CTA */}
      {bubbles.length >= 2 && (
        <motion.div
          className="mx-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setScreen('debrief')}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background: 'rgba(0,210,200,0.15)',
              border: '1px solid rgba(0,210,200,0.35)',
              color: '#00D2C8',
            }}
          >
            <Brain size={18} />
            Llevar al Debrief ({bubbles.length} burbujas)
          </button>
        </motion.div>
      )}

      {/* Focus modal */}
      <AnimatePresence>
        {focusedBubble && focusedBubbleData && (
          <FocusModal bubble={focusedBubbleData} onClose={() => setFocusedBubble(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
