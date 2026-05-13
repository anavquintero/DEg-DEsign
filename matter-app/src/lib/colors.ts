export const emotionColors = {
  anger:       { primary: '#FF4B2B', secondary: '#FF6F47', glow: 'rgba(255,75,43,0.35)' },
  frustration: { primary: '#FF8C00', secondary: '#FFA833', glow: 'rgba(255,140,0,0.35)' },
  annoyance:   { primary: '#FFCA28', secondary: '#FFD966', glow: 'rgba(255,202,40,0.35)' },
  anxiety:     { primary: '#6C63FF', secondary: '#9D97FF', glow: 'rgba(108,99,255,0.35)' },
  fatigue:     { primary: '#4A90D9', secondary: '#7BB8F0', glow: 'rgba(74,144,217,0.35)' },
  sadness:     { primary: '#3D5A80', secondary: '#6B8EAD', glow: 'rgba(61,90,128,0.35)' },
  burnout:     { primary: '#7B4FA6', secondary: '#A67BC8', glow: 'rgba(123,79,166,0.35)' },
} as const;

export type EmotionType = keyof typeof emotionColors;

export const triagePalettes = {
  green: {
    bg: '#FFFDF5',
    card: 'rgba(255,255,255,0.55)',
    border: 'rgba(255,202,40,0.35)',
    gradient: 'radial-gradient(ellipse at center, rgba(255,202,40,0.06) 0%, transparent 70%)',
  },
  yellow: {
    bg: '#0D0D1A',
    card: 'rgba(108,99,255,0.12)',
    border: 'rgba(108,99,255,0.3)',
    gradient: 'radial-gradient(ellipse at center, rgba(108,99,255,0.08) 0%, transparent 70%)',
  },
  debrief: {
    bg: '#071A1E',
    accent: '#00D2C8',
    accentSoft: '#00F0E4',
    card: 'rgba(0,210,200,0.08)',
    border: 'rgba(0,240,228,0.25)',
    glow: 'rgba(0,210,200,0.25)',
  },
  crisis: {
    bg: '#111111',
    card: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.1)',
  },
};

export const sampleBubbles = [
  { id: '1', text: 'El deadline que movieron otra vez', emotion: 'frustration' as EmotionType, intensity: 0.7, x: 20, y: 25 },
  { id: '2', text: 'No dormí bien', emotion: 'fatigue' as EmotionType, intensity: 0.5, x: 60, y: 15 },
  { id: '3', text: 'Esa conversación pendiente', emotion: 'anxiety' as EmotionType, intensity: 0.85, x: 75, y: 45 },
  { id: '4', text: 'El tráfico de hoy', emotion: 'annoyance' as EmotionType, intensity: 0.4, x: 15, y: 60 },
  { id: '5', text: 'Semanas sin descansar de verdad', emotion: 'burnout' as EmotionType, intensity: 0.9, x: 45, y: 65 },
];
