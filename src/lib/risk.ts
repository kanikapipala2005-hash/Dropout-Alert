import type { RiskLevel, FeesStatus } from '@/types';

export function calculateRisk(
  attendance: number,
  fees: FeesStatus,
  marks: number
): RiskLevel {
  let points = 0;
  if (attendance < 60) points += 1;
  if (fees === 'Pending') points += 1;
  if (marks < 40) points += 1;

  if (points === 3) return 'HIGH';
  if (points === 2) return 'MEDIUM';
  return 'SAFE';
}

export const riskConfig: Record<
  RiskLevel,
  {
    label: string;
    badge: string;
    card: string;
    dot: string;
    text: string;
    ring: string;
  }
> = {
  HIGH: {
    label: 'High Risk',
    badge: 'bg-red-500/15 text-red-400 border-red-500/40',
    card: 'bg-[#1E293B] border-red-500/30 shadow-red-500/10',
    dot: 'bg-red-500',
    text: 'text-red-400',
    ring: 'ring-red-500/10',
  },
  MEDIUM: {
    label: 'Medium Risk',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    card: 'bg-[#1E293B] border-amber-500/30 shadow-amber-500/10',
    dot: 'bg-amber-500',
    text: 'text-amber-400',
    ring: 'ring-amber-500/10',
  },
  SAFE: {
    label: 'Safe',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    card: 'bg-[#1E293B] border-emerald-500/30 shadow-emerald-500/10',
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/10',
  },
};
