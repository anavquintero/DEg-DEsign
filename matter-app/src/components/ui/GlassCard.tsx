'use client';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  teal?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className = '', dark = false, teal = false, style }: GlassCardProps) {
  const base = 'rounded-3xl border backdrop-blur-xl';
  const variant = teal
    ? 'bg-[rgba(0,210,200,0.08)] border-[rgba(0,240,228,0.25)]'
    : dark
    ? 'bg-[rgba(108,99,255,0.10)] border-[rgba(108,99,255,0.25)]'
    : 'bg-[rgba(255,255,255,0.55)] border-[rgba(255,255,255,0.4)]';

  return (
    <div
      className={`${base} ${variant} ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)', ...style }}
    >
      {children}
    </div>
  );
}
