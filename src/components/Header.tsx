import { GraduationCap, ShieldAlert } from 'lucide-react';

export default function Header() {
  return (
    <header className="header-gradient text-white animate-slide-down border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/30 backdrop-blur-sm">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
              Student Dropout Early-Warning System
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#22C55E]" />
              Early Detection &amp; Risk Monitoring Dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
