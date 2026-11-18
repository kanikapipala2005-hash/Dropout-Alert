import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { Student } from '@/types';

interface Props {
  students: Student[];
}

export default function RiskChart({ students }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const high = students.filter((s) => s.risk === 'HIGH').length;
  const medium = students.filter((s) => s.risk === 'MEDIUM').length;
  const safe = students.filter((s) => s.risk === 'SAFE').length;
  const max = Math.max(high, medium, safe, 1);

  const bars = [
    {
      label: 'High Risk',
      value: high,
      color: 'bg-red-500',
      glow: 'shadow-red-500/30',
      text: 'text-red-400',
      track: 'bg-red-500/5',
    },
    {
      label: 'Medium Risk',
      value: medium,
      color: 'bg-amber-500',
      glow: 'shadow-amber-500/30',
      text: 'text-amber-400',
      track: 'bg-amber-500/5',
    },
    {
      label: 'Safe',
      value: safe,
      color: 'bg-[#22C55E]',
      glow: 'shadow-[#22C55E]/30',
      text: 'text-[#22C55E]',
      track: 'bg-[#22C55E]/5',
    },
  ];

  return (
    <div
      className="bg-[#1E293B] rounded-2xl border border-slate-700 shadow-lg p-5 sm:p-6 animate-fade-in-up"
      style={{ animationDelay: '0.3s' }}
    >
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">Risk Distribution</h2>
      </div>
      <p className="text-sm text-slate-400 mt-1">
        Visual breakdown of student risk levels
      </p>

      <div className="mt-6 flex items-end justify-around gap-4 sm:gap-8 h-40 sm:h-52">
        {bars.map((bar, i) => (
          <div
            key={bar.label}
            className="flex flex-col items-center gap-2 flex-1 max-w-[80px]"
          >
            <span
              className={`text-xl sm:text-2xl font-extrabold ${bar.text} tabular-nums`}
            >
              {bar.value}
            </span>
            <div
              className={`w-full flex-1 flex items-end justify-center rounded-lg ${bar.track}`}
            >
              <div
                className={`w-full max-w-[44px] rounded-t-lg ${bar.color} shadow-lg ${bar.glow} transition-all duration-700 ease-out`}
                style={{
                  height: mounted ? `${(bar.value / max) * 100}%` : '0%',
                  transitionDelay: `${i * 0.12}s`,
                  minHeight: mounted && bar.value > 0 ? '8px' : '0',
                }}
              />
            </div>
            <span className="text-xs font-medium text-slate-400 text-center">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
