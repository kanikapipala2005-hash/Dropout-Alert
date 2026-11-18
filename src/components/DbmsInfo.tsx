import { useState } from 'react';
import { Database, ChevronDown, Copy, Check } from 'lucide-react';

const joinQuery = `-- JOIN: Identify students at risk of dropping out
-- by combining attendance, fees, and marks tables
SELECT
    s.student_id,
    s.student_name,
    s.roll_no,
    COUNT(DISTINCT a.date)         AS total_classes,
    ROUND(100.0 * SUM(CASE WHEN a.status='Present'
                      THEN 1 ELSE 0 END)
          / COUNT(DISTINCT a.date), 2) AS attendance_pct,
    f.fees_status,
    AVG(m.marks_obtained)          AS avg_marks
FROM students s
INNER JOIN attendance a  ON s.student_id = a.student_id
INNER JOIN fees       f  ON s.student_id = f.student_id
INNER JOIN marks      m  ON s.student_id = m.student_id
GROUP BY s.student_id, s.student_name, s.roll_no, f.fees_status
HAVING
    ROUND(100.0 * SUM(CASE WHEN a.status='Present'
                      THEN 1 ELSE 0 END)
          / COUNT(DISTINCT a.date), 2) < 60
    AND AVG(m.marks_obtained) < 40
    AND f.fees_status = 'Pending'
ORDER BY attendance_pct ASC;`;

const triggerQuery = `-- TRIGGER: Auto-flag students as HIGH RISK
-- when attendance drops below 60% AND fees are pending
CREATE OR REPLACE FUNCTION flag_high_risk()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.attendance_pct < 60
       AND NEW.fees_status = 'Pending'
       AND NEW.avg_marks   < 40 THEN
        INSERT INTO risk_alerts (student_id, risk_level, alert_date)
        VALUES (NEW.student_id, 'HIGH', NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET risk_level='HIGH', alert_date=NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_flag_high_risk
AFTER INSERT OR UPDATE ON student_summary
FOR EACH ROW
EXECUTE FUNCTION flag_high_risk();`;

function CodeBlock({
  title,
  code,
  lang,
}: {
  title: string;
  code: string;
  lang: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-[#0F172A] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E293B] border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
          </span>
          <span className="text-xs font-medium text-slate-400 ml-2">
            {title}
          </span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-slate-300">
        <code className={`language-${lang}`}>{code}</code>
      </pre>
    </div>
  );
}

export default function DbmsInfo() {
  const [open, setOpen] = useState(true);

  return (
    <section
      className="bg-[#1E293B] rounded-2xl border border-slate-700 shadow-lg overflow-hidden animate-fade-in-up"
      style={{ animationDelay: '0.4s' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-5 hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/15">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white">
              DBMS Concepts
            </h2>
            <p className="text-sm text-slate-400">
              SQL query with JOIN, GROUP BY, HAVING &amp; a Trigger example
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-6 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                <span className="inline-block w-1.5 h-5 bg-cyan-500 rounded-full" />
                JOIN + GROUP BY + HAVING
              </h3>
              <CodeBlock
                title="risk_query.sql"
                lang="sql"
                code={joinQuery}
              />
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Joins four tables (students, attendance, fees, marks), groups
                per student, and uses <strong>HAVING</strong> to filter only
                at-risk students (attendance &lt; 60%, marks &lt; 40, fees
                pending).
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                <span className="inline-block w-1.5 h-5 bg-red-500 rounded-full" />
                TRIGGER Example
              </h3>
              <CodeBlock
                title="flag_trigger.sql"
                lang="sql"
                code={triggerQuery}
              />
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                A PL/pgSQL <strong>trigger</strong> fires after any insert or
                update on <code className="text-cyan-400">student_summary</code>{' '}
                and auto-inserts a HIGH risk alert when all three risk
                conditions are met.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-cyan-300 mb-3">
              Risk Scoring Logic
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { cond: 'Attendance < 60%', pt: '+1 point' },
                { cond: 'Fees Status = Pending', pt: '+1 point' },
                { cond: 'Marks < 40 / 100', pt: '+1 point' },
              ].map((r) => (
                <div
                  key={r.cond}
                  className="bg-[#0F172A] rounded-lg border border-slate-700 px-3 py-2.5"
                >
                  <p className="text-xs font-semibold text-slate-200">
                    {r.cond}
                  </p>
                  <p className="text-xs text-cyan-400 mt-0.5">{r.pt}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                3 points = HIGH RISK
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                2 points = MEDIUM RISK
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                0-1 points = SAFE
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
