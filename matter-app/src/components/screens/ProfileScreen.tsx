'use client';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMatterStore } from '@/lib/store';
import { emotionColors, EmotionType } from '@/lib/colors';

const heatmapData = [
  [0,0,1,0,0,0,0,0,2,1,0,0,1,0,0,0,0,3,2,1,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,2,1,0,0,0,1,0,2,3,1,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,1,2,0,1,0,0,0,0,3,4,2,0,0,0,0,0],
  [0,0,1,0,0,0,0,1,2,1,0,0,0,1,0,1,2,3,1,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,1,0,2,1,0,0,1,2,3,2,0,0,0,0,0,0],
  [0,0,0,2,1,0,0,0,0,1,0,0,2,1,0,0,1,2,1,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,2,1,0,0,0,1,0,0,1,0,0,0,0,0,0],
];
const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const heatColors = ['transparent','rgba(108,99,255,0.15)','rgba(108,99,255,0.4)','rgba(108,99,255,0.65)','rgba(108,99,255,0.9)'];

const reframes = [
  { text: '"Los deadlines son ficción colectiva. Desarrollos a las 11."', emotion: 'frustration' as EmotionType, date: 'Hoy' },
  { text: '"Merezco descanso y presencia, no solo productividad."', emotion: 'burnout' as EmotionType, date: 'Ayer' },
  { text: '"Merezco descanso y presencia, no solo productividad."', emotion: 'anxiety' as EmotionType, date: 'Lun' },
];

const stats = [
  { label: 'Burbujas soltadas', value: '47', sub: 'este mes' },
  { label: 'Hora pico de estrés', value: '17–18h', sub: 'cierre de jornada' },
  { label: 'Emoción dominante', value: 'Ansiedad', sub: '38% del tiempo' },
  { label: 'Re-Frames guardados', value: '12', sub: 'en tu galería' },
];

export function ProfileScreen() {
  const { triageLevel } = useMatterStore();
  const isDark = triageLevel === 'yellow';

  return (
    <div
      className="min-h-screen pb-28 transition-colors duration-700"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.1) 0%, #0D0D1A 60%)'
          : 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.06) 0%, #F8F7FF 60%)',
      }}
    >
      {/* Header */}
      <div className="pt-16 px-5 pb-6">
        <h2 className="text-2xl font-extrabold" style={{ color: isDark ? '#F0F0FF' : '#1A1A2E' }}>
          El Reflejo
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-black/35'}`}>
          Tu huella cognitiva de mayo 2026
        </p>
      </div>

      {/* Stats grid */}
      <div className="px-5 mb-6 grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlassCard dark={isDark} className="p-4">
              <p
                className="text-2xl font-extrabold mb-0.5"
                style={{ color: isDark ? '#9D97FF' : '#6C63FF' }}
              >
                {s.value}
              </p>
              <p className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-black/60'}`}>{s.label}</p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-black/30'}`}>{s.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Heatmap */}
      <motion.div
        className="px-5 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard dark={isDark} className="p-4">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-white/40' : 'text-black/35'}`}>
            Mapa de calor — esta semana
          </p>
          <div className="flex gap-1.5">
            <div className="flex flex-col gap-1 pr-1">
              {days.map((d) => (
                <div key={d} className={`text-[9px] w-6 text-right ${isDark ? 'text-white/25' : 'text-black/25'}`} style={{ height: 14, lineHeight: '14px' }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="flex-1 overflow-hidden">
              {heatmapData.map((row, ri) => (
                <div key={ri} className="flex gap-0.5 mb-0.5">
                  {row.map((val, ci) => (
                    <div
                      key={ci}
                      className="rounded-sm flex-1"
                      style={{
                        height: 14,
                        background: val > 0 ? heatColors[Math.min(val, 4)] : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                      }}
                    />
                  ))}
                </div>
              ))}
              <div className="flex mt-1">
                {['0','6','12','18','23'].map((h) => (
                  <div key={h} className={`text-[9px] flex-1 text-left ${isDark ? 'text-white/20' : 'text-black/20'}`}>{h}h</div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Emotion breakdown */}
      <motion.div
        className="px-5 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard dark={isDark} className="p-4">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-white/40' : 'text-black/35'}`}>
            Emociones dominantes
          </p>
          {([
            ['anxiety', 38],
            ['burnout', 27],
            ['frustration', 20],
            ['fatigue', 15],
          ] as [EmotionType, number][]).map(([emotion, pct]) => (
            <div key={emotion} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs capitalize" style={{ color: emotionColors[emotion].secondary }}>
                  {emotion === 'anxiety' ? 'Ansiedad' : emotion === 'burnout' ? 'Burnout' : emotion === 'frustration' ? 'Frustración' : 'Fatiga'}
                </span>
                <span className="text-xs font-bold" style={{ color: emotionColors[emotion].primary }}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${emotionColors[emotion].primary}, ${emotionColors[emotion].secondary})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </GlassCard>
      </motion.div>

      {/* Re-Frame gallery */}
      <motion.div
        className="px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDark ? 'text-white/40' : 'text-black/35'}`}>
          Galería de Re-Frames
        </p>
        <div className="flex flex-col gap-3">
          {reframes.map((r, i) => {
            const color = emotionColors[r.emotion];
            return (
              <GlassCard key={i} dark={isDark} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: color.primary, boxShadow: `0 0 8px ${color.glow}` }}
                  />
                  <div>
                    <p
                      className="text-sm leading-snug"
                      style={{ color: isDark ? '#E8F8F7' : '#1A1A2E', fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {r.text}
                    </p>
                    <p className={`text-xs mt-1.5 ${isDark ? 'text-white/30' : 'text-black/30'}`}>{r.date}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
