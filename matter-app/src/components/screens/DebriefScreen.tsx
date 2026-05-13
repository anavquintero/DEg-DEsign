'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Flame, ChevronRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMatterStore } from '@/lib/store';
import { emotionColors } from '@/lib/colors';

interface ResponseItem {
  filter: string;
  emoji: string;
  text: string;
  translate?: string;
  action: string;
}

const greenResponses: ResponseItem[] = [
  {
    filter: 'TL;DR Profesional',
    emoji: '📋',
    text: '"Adulto descubre que el sistema opera con reglas distintas a las prometidas. Sorpresa nula. Viernes en peligro."',
    action: '¿Ya lo procesaste? Dale POP a todo.',
  },
  {
    filter: 'Gen-Z Translator',
    emoji: '💀',
    text: '"Bestie no-cap tu cerebro está en modo main character de una distopía corporativa y nadie le avisó. Understood the assignment? No. Never."',
    action: '¿Listo para archivarlo? Congélalo.',
  },
  {
    filter: 'Poesía Absurda',
    emoji: '🎭',
    text: '"Había una vez un deadline / que nadie respetó / el calendario lloró / y el equipo sobrevivió."',
    action: '¿Lo sueltas? POP y que vuele.',
  },
];

const yellowResponses: ResponseItem[] = [
  {
    filter: 'Contenedor Seguro',
    emoji: '🫂',
    text: 'Escucho que llevas semanas cargando esto sola, sin que nadie lo note. Eso tiene todo el sentido. Cuando das tanto y recibes tan poco, el cuerpo y la mente mandan la factura.',
    translate: '"Merezco descanso y presencia, no solo productividad."',
    action: 'Si quieres, puedes congelarlo por ahora. Tú decides.',
  },
  {
    filter: 'Límite Asertivo',
    emoji: '🛡️',
    text: 'Lo que describes suena a que estás cargando responsabilidades que no son solo tuyas. Tiene sentido que estés agotada — eso no es debilidad.',
    translate: '"Necesito que las cargas se distribuyan de manera justa."',
    action: 'Archívalo o déjalo salir. Sin presión.',
  },
];

export function DebriefScreen() {
  const { bubbles, triageLevel, popAll, setScreen } = useMatterStore();
  const [responseIdx, setResponseIdx] = useState(0);
  const [popping, setPopping] = useState(false);

  const isYellow = triageLevel === 'yellow';
  const responses = isYellow ? yellowResponses : greenResponses;
  const response = responses[responseIdx % responses.length];

  const handleReload = () => setResponseIdx((i) => i + 1);

  const handlePopAll = () => {
    setPopping(true);
    setTimeout(() => {
      popAll();
      setPopping(false);
      setScreen('home');
    }, 1200);
  };

  const activeBubbles = bubbles.slice(0, 5);

  return (
    <div
      className="min-h-screen pb-28 transition-colors duration-700 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,210,200,0.12) 0%, #071A1E 55%)' }}
    >
      {/* Header */}
      <div className="pt-16 px-5 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} color="#00D2C8" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00D2C8]">El Debrief</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#E8F8F7]">
          Procesa tu materia
        </h2>
        <p className="text-sm text-[#8ECECA] mt-1">
          {bubbles.length} burbuja{bubbles.length !== 1 ? 's' : ''} en el hilo
        </p>
      </div>

      {/* Active bubbles strip */}
      {activeBubbles.length > 0 && (
        <div className="px-5 mb-6 overflow-x-auto">
          <div className="flex gap-2 w-max">
            {activeBubbles.map((b) => {
              const color = emotionColors[b.emotion];
              return (
                <motion.div
                  key={b.id}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                  style={{
                    background: `${color.primary}30`,
                    border: `1px solid ${color.primary}50`,
                    color: color.secondary,
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {b.text.slice(0, 22)}{b.text.length > 22 ? '…' : ''}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Response card */}
      <div className="px-5 mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={responseIdx}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <GlassCard teal className="p-5">
              {/* Filter badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#00D2C8] uppercase tracking-widest">
                  <span>{response.emoji}</span>
                  {response.filter}
                </span>
                <button
                  onClick={handleReload}
                  className="flex items-center gap-1 text-xs text-[#8ECECA] hover:text-[#00D2C8] transition-colors"
                >
                  <motion.div whileTap={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                    <RefreshCw size={13} />
                  </motion.div>
                  Reload
                </button>
              </div>

              {/* Response text */}
              <p
                className="text-[#E8F8F7] text-sm leading-relaxed mb-4"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {response.text}
              </p>

              {/* Assertive boundary (yellow only) */}
              {'translate' in response && response.translate && (
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: 'rgba(0,210,200,0.08)', border: '1px solid rgba(0,210,200,0.2)' }}
                >
                  <p className="text-xs text-[#8ECECA] mb-1 font-semibold">Lo que necesitas reconocer:</p>
                  <p className="text-[#00F0E4] text-sm font-medium italic">{response.translate}</p>
                </div>
              )}

              {/* Action hint */}
              <p className="text-[#8ECECA] text-xs leading-relaxed">{response.action}</p>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reload suggestion */}
      <div className="px-5 mb-6">
        <p className="text-center text-xs text-[#8ECECA]/60">
          ¿No aterrizó? Prueba otro ángulo con{' '}
          <button onClick={handleReload} className="text-[#00D2C8] font-semibold">
            Reload
          </button>
        </p>
      </div>

      {/* POP ALL */}
      <div className="px-5">
        <AnimatePresence>
          {popping && (
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: ['#00D2C8', '#00F0E4', '#6C63FF', '#FFD966', '#FF8C00'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: -300, opacity: 0, scale: [1, 1.5, 0] }}
                  transition={{ duration: 1, delay: Math.random() * 0.4, ease: 'easeOut' }}
                />
              ))}
              <motion.p
                className="text-6xl"
                animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 1 }}
              >
                🫧
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handlePopAll}
          disabled={bubbles.length === 0 || popping}
          className="w-full py-5 rounded-2xl font-extrabold text-[#071A1E] text-lg flex items-center justify-center gap-3 disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #00D2C8, #00F0E4)',
            boxShadow: '0 8px 32px rgba(0,210,200,0.4)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          <Flame size={22} />
          Procesar Materia
          <ChevronRight size={20} />
        </motion.button>

        <p className="text-center text-xs text-[#8ECECA]/50 mt-3">
          Esto explorará todas tus burbujas de una vez
        </p>
      </div>
    </div>
  );
}
