import { Users, AlertOctagon, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { Student } from '@/types';
import { useCountUp } from '@/hooks/useCountUp';

interface Props {
  students: Student[];
}

interface CardData {
  label: string;
  value: number;
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
  border: string;
  ring: string;
}

function DashboardCard({ card, index }: { card: CardData; index: number }) {
  const count = useCountUp(card.value);
  const Icon = card.icon;

  return (
    <div
      className={`bg-[#1E293B] rounded-2xl border ${card.border} ring-4 ${card.ring} p-4 sm:p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up group`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
        </div>
      </div>
      <p className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {count}
      </p>
      <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
        {card.label}
      </p>
    </div>
  );
}

export default function DashboardCards({ students }: Props) {
  const total = students.length;
  const high = students.filter((s) => s.risk === 'HIGH').length;
  const medium = students.filter((s) => s.risk === 'MEDIUM').length;
  const safe = students.filter((s) => s.risk === 'SAFE').length;

  const cards: CardData[] = [
    {
      label: 'Total Students',
      value: total,
      icon: Users,
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      border: 'border-cyan-500/30',
      ring: 'ring-cyan-500/5',
    },
    {
      label: 'High Risk',
      value: high,
      icon: AlertOctagon,
      iconBg: 'bg-red-500/15',
      iconColor: 'text-red-400',
      border: 'border-red-500/30',
      ring: 'ring-red-500/5',
    },
    {
      label: 'Medium Risk',
      value: medium,
      icon: ShieldAlert,
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      border: 'border-amber-500/30',
      ring: 'ring-amber-500/5',
    },
    {
      label: 'Safe',
      value: safe,
      icon: ShieldCheck,
      iconBg: 'bg-[#22C55E]/15',
      iconColor: 'text-[#22C55E]',
      border: 'border-[#22C55E]/30',
      ring: 'ring-[#22C55E]/5',
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {cards.map((card, index) => (
          <DashboardCard key={card.label} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
