import { useState } from 'react';
import { Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Student, FeesStatus, RiskLevel } from '@/types';
import { calculateRisk, riskConfig } from '@/lib/risk';
import { fireConfetti } from '@/lib/confetti';
import RippleButton from '@/components/RippleButton';

interface Props {
  onAdd: (student: Student) => void;
}

interface FormState {
  name: string;
  rollNo: string;
  attendance: string;
  fees: FeesStatus;
  marks: string;
}

const empty: FormState = {
  name: '',
  rollNo: '',
  attendance: '',
  fees: 'Paid',
  marks: '',
};

export default function AddStudentForm({ onAdd }: Props) {
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');
  const [previewRisk, setPreviewRisk] = useState<Student['risk'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ name: string; risk: RiskLevel } | null>(null);
  const [shaking, setShaking] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    setError('');
    const att = parseFloat(next.attendance);
    const mk = parseFloat(next.marks);
    if (next.attendance !== '' && next.marks !== '' && !isNaN(att) && !isNaN(mk)) {
      setPreviewRisk(calculateRisk(att, next.fees, mk));
    } else {
      setPreviewRisk(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const rollNo = form.rollNo.trim();
    const attendance = parseFloat(form.attendance);
    const marks = parseFloat(form.marks);

    if (!name) return setError('Student name is required.');
    if (!rollNo) return setError('Roll number is required.');
    if (isNaN(attendance) || attendance < 0 || attendance > 100)
      return setError('Attendance must be a number between 0 and 100.');
    if (isNaN(marks) || marks < 0 || marks > 100)
      return setError('Marks must be a number between 0 and 100.');

    const risk = calculateRisk(attendance, form.fees, marks);
    const student: Student = {
      id: crypto.randomUUID(),
      name,
      rollNo,
      attendance,
      fees: form.fees,
      marks,
      risk,
      createdAt: Date.now(),
    };

    setSaving(true);
    setTimeout(() => {
      onAdd(student);
      setForm(empty);
      setPreviewRisk(null);
      setSaving(false);
      setSuccess({ name: student.name, risk: student.risk });

      if (student.risk === 'SAFE') {
        fireConfetti();
      } else if (student.risk === 'HIGH') {
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
      }

      setTimeout(() => setSuccess(null), 3500);
    }, 300);
  }

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300';

  return (
    <div
      className={`bg-[#1E293B] rounded-2xl border border-slate-700 shadow-lg p-5 sm:p-6 ${
        shaking ? 'animate-shake' : ''
      }`}
    >
      {success && (
        <div
          className={`animate-success-slide-in mb-4 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold border ${
            success.risk === 'SAFE'
              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
              : success.risk === 'MEDIUM'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}
        >
          {success.risk === 'SAFE' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>
            {success.name} added &mdash; {riskConfig[success.risk].label}
          </span>
        </div>
      )}

      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Plus className="w-5 h-5 text-cyan-400" />
        Add Student
      </h2>
      <p className="text-sm text-slate-400 mt-1">
        Risk is calculated automatically from attendance, fees, and marks.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Student Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Roll No
            </label>
            <input
              type="text"
              value={form.rollNo}
              onChange={(e) => update('rollNo', e.target.value)}
              placeholder="e.g. CS21001"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Attendance %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.attendance}
              onChange={(e) => update('attendance', e.target.value)}
              placeholder="0 - 100"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Fees Status
            </label>
            <select
              value={form.fees}
              onChange={(e) => update('fees', e.target.value as FeesStatus)}
              className={inputClass}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Marks /100
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.marks}
              onChange={(e) => update('marks', e.target.value)}
              placeholder="0 - 100"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-[#0F172A] border border-slate-700 px-4 py-3 transition-all duration-300">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Predicted Risk
          </span>
          {previewRisk ? (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${riskConfig[previewRisk].badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${riskConfig[previewRisk].dot}`} />
              {riskConfig[previewRisk].label}
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Enter attendance, fees &amp; marks to preview
            </span>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 animate-success-slide-in">
            {error}
          </p>
        )}

        <RippleButton
          type="submit"
          disabled={saving}
          className="w-full bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-semibold text-sm rounded-lg px-4 py-3 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Check Risk &amp; Add Student
        </RippleButton>
      </form>
    </div>
  );
}
