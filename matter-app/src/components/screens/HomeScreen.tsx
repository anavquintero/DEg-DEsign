'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMatterStore } from '@/lib/store';
import { emotionColors, EmotionType } from '@/lib/colors';

const emotions: { key: EmotionType; label: string; emoji: string }[] = [
  { key: 'anger',       label: 'Enojo',       emoji: '🔥' },
  { key: 'frustration', label: 'Frustración', emoji: '😤' },
  { key: 'annoyance',   label: 'Molestia',    emoji: '😒' },
  { key: 'anxiety',     label: 'Ansiedad',    emoji: '😰' },
  { key: 'fatigue',     label: 'Fatiga',      emoji: '😮‍💨' },
  { key: 'sadness',     label: 'Tristeza',    emoji: '💙' },
  { key: 'burnout',     label: 'Burnout',     emoji: '🥵' },
];

export function HomeScreen() {
  const { inputText, setInputText, addBubble, setScreen, isRecording, setRecording, triageLevel, setTriageLevel } = useMatterStore();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('frustration');
  const [intensity, setIntensity] = useState(0.6);
  const [micPulse, setMicPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = triageLevel === 'yellow';
  const activeColor = emotionColors[selectedEmotion].primary;

  const handleMicPress = () => {
    setRecording(true);
    setMicPulse(true);
    timerRef.current = setTimeout(() => {
      setRecording(false);
      setMicPulse(false);
      setInputText('No sé, simplemente estoy agotada de aguantar todo sin decirle nada a nadie.');
    }, 2500);
  };

  const handleMicRelease = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isRecording) {
      setRecording(false);
      setMicPulse(false);
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    const level = selectedEmotion === 'anxiety' || selectedEmotion === 'burnout' || selectedEmotion === 'sadness' || selectedEmotion === 'fatigue' ? 'yellow' : 'green';
    setTriageLevel(level);
    addBubble({ text: inputText.trim(), emotion: selectedEmotion, intensity });
    setScreen('space');
  };

  return (
    <div
      className="min-h-screen flex flex-col px-5 pt-16 pb-28 transition-colors duration-700"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 20%, rgba(108,99,255,0.12) 0%, #0D0D1A 60%)'
          : 'radial-gradient(ellipse at 50% 20%, rgba(255,202,40,0.08) 0%, #FFFDF5 60%)',
      }}
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white/40' : 'text-black/30'}`}>
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: isDark ? '#F0F0FF' : '#1A1A2E', fontFamily: 'system-ui' }}
        >
          Hola, Camila
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-black/40'}`}>
          ¿Qué te está pesando hoy?
        </p>
      </motion.div>

      {/* Mic button */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative">
          <AnimatePresence>
            {micPulse && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${activeColor}40 0%, transparent 70%)` }}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${activeColor}60` }}
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </AnimatePresence>

          <motion.button
            className="relative w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-xl border-2 transition-all duration-200 select-none"
            style={{
              background: isRecording
                ? `radial-gradient(circle, ${activeColor}30, rgba(255,255,255,0.7))`
                : 'rgba(255,255,255,0.7)',
              borderColor: isRecording ? activeColor : 'rgba(255,255,255,0.6)',
              boxShadow: isRecording
                ? `0 0 32px ${activeColor}50, 0 8px 24px rgba(0,0,0,0.1)`
                : '0 8px 24px rgba(0,0,0,0.1)',
            }}
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            whileTap={{ scale: 0.92 }}
          >
            {isRecording
              ? <MicOff size={32} color={activeColor} />
              : <Mic size={32} color={activeColor} />
            }
          </motion.button>
        </div>

        <p className={`mt-3 text-xs font-medium ${isDark ? 'text-white/40' : 'text-black/35'}`}>
          {isRecording ? 'Suelta para terminar…' : 'Mantén presionado y habla'}
        </p>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
        <span className={`text-xs ${isDark ? 'text-white/30' : 'text-black/25'}`}>o escríbelo</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
      </div>

      {/* Text input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard dark={isDark} className="p-4 mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Deja salir todo lo que traes... sin filtros."
            rows={4}
            className={`w-full bg-transparent resize-none outline-none text-sm leading-relaxed
              ${isDark ? 'text-white/80 placeholder:text-white/25' : 'text-black/70 placeholder:text-black/25'}`}
            style={{ fontFamily: 'system-ui' }}
          />
        </GlassCard>
      </motion.div>

      {/* Emotion selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-5"
      >
        <p className={`text-xs font-semibold mb-2 uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/30'}`}>
          ¿Qué sientes?
        </p>
        <div className="flex flex-wrap gap-2">
          {emotions.map(({ key, label, emoji }) => {
            const active = selectedEmotion === key;
            return (
              <motion.button
                key={key}
                onClick={() => setSelectedEmotion(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                style={{
                  background: active ? `${emotionColors[key].primary}20` : 'transparent',
                  borderColor: active ? emotionColors[key].primary : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                  color: active ? emotionColors[key].primary : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{emoji}</span> {label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Intensity slider */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-black/30'}`}>
            Intensidad
          </p>
          <span className="text-xs font-bold" style={{ color: activeColor }}>
            {Math.round(intensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full accent-current h-1.5 rounded-full"
          style={{ accentColor: activeColor }}
        />
      </motion.div>

      {/* Submit */}
      <motion.button
        onClick={handleSubmit}
        disabled={!inputText.trim()}
        className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40"
        style={{
          background: inputText.trim()
            ? `linear-gradient(135deg, ${activeColor}, ${emotionColors[selectedEmotion].secondary})`
            : 'rgba(0,0,0,0.15)',
          boxShadow: inputText.trim() ? `0 8px 24px ${emotionColors[selectedEmotion].glow}` : 'none',
        }}
        whileTap={{ scale: 0.97 }}
      >
        <Send size={18} />
        Materializar
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}
