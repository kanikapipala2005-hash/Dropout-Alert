import { useMemo, useState } from 'react';
import { Search, Trash2, Users2, Filter } from 'lucide-react';
import type { Student, RiskLevel } from '@/types';
import { riskConfig } from '@/lib/risk';
import RippleButton from '@/components/RippleButton';

interface Props {
  students: Student[];
  onDelete: (id: string) => void;
  onResetDemo: () => void;
}

type FilterValue = 'ALL' | RiskLevel;

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'HIGH', label: 'High Risk' },
  { value: 'MEDIUM', label: 'Medium Risk' },
  { value: 'SAFE', label: 'Safe' },
];

const pulseClass: Record<RiskLevel, string> = {
  HIGH: 'animate-pulse-red',
  MEDIUM: 'animate-pulse-amber',
  SAFE: 'animate-pulse-green',
};

export default function StudentTable({ students, onDelete, onResetDemo }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students
      .filter((s) => {
        if (filter !== 'ALL' && s.risk !== filter) return false;
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [students, search, filter]);

  function handleDelete(id: string) {
    if (deletingIds.has(id)) return;
    setDeletingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onDelete(id);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 400);
  }

  return (
    <div className="bg-[#1E293B] rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-cyan-400" />
            Student Records
          </h2>
          <RippleButton
            type="button"
            onClick={onResetDemo}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg px-3 py-1.5 hover:bg-cyan-500/10"
          >
            Reset Demo Data
          </RippleButton>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll number..."
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
            <div className="flex gap-1 bg-[#0F172A] rounded-lg p-1 border border-slate-700">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-300 active:scale-95 ${
                    filter === opt.value
                      ? 'bg-[#1E293B] text-cyan-400 shadow-sm border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0F172A] text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <th className="px-4 sm:px-6 py-3">Name</th>
              <th className="px-4 py-3">Roll No</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">Fees</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 sm:px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No students found. Add one above or reset demo data.
                </td>
              </tr>
            ) : (
              filtered.map((s, index) => {
                const cfg = riskConfig[s.risk];
                const isDeleting = deletingIds.has(s.id);
                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-700/30 transition-all duration-300 ${
                      isDeleting
                        ? 'animate-row-fade-out'
                        : 'animate-row-slide-in'
                    }`}
                    style={{
                      animationDelay: isDeleting
                        ? undefined
                        : `${Math.min(index * 0.04, 0.3)}s`,
                    }}
                  >
                    <td className="px-4 sm:px-6 py-3 font-medium text-white">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                      {s.rollNo}
                    </td>
                    <td className="px-4 py-3 text-slate-300 tabular-nums">
                      {s.attendance}%
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${
                          s.fees === 'Paid'
                            ? 'bg-[#22C55E]/15 text-[#22C55E]'
                            : 'bg-orange-500/15 text-orange-400'
                        }`}
                      >
                        {s.fees}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 tabular-nums">
                      {s.marks}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge} ${pulseClass[s.risk]}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        aria-label={`Delete ${s.name}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 sm:px-6 py-3 border-t border-slate-700 text-xs text-slate-500">
        Showing {filtered.length} of {students.length} students
      </div>
    </div>
  );
}
