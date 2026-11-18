import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DashboardCards from '@/components/DashboardCards';
import RiskChart from '@/components/RiskChart';
import AddStudentForm from '@/components/AddStudentForm';
import StudentTable from '@/components/StudentTable';
import DbmsInfo from '@/components/DbmsInfo';
import type { Student } from '@/types';
import { loadStudents, saveStudents, resetToDemo } from '@/lib/storage';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(loadStudents());
  }, []);

  function persist(next: Student[]) {
    setStudents(next);
    saveStudents(next);
  }

  function handleAdd(student: Student) {
    persist([student, ...students]);
  }

  function handleDelete(id: string) {
    persist(students.filter((s) => s.id !== id));
  }

  function handleResetDemo() {
    persist(resetToDemo());
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <DashboardCards students={students} />

        <RiskChart students={students} />

        <div
          className="grid lg:grid-cols-5 gap-6 animate-fade-in-up"
          style={{ animationDelay: '0.35s' }}
        >
          <div className="lg:col-span-2">
            <AddStudentForm onAdd={handleAdd} />
          </div>
          <div className="lg:col-span-3">
            <StudentTable
              students={students}
              onDelete={handleDelete}
              onResetDemo={handleResetDemo}
            />
          </div>
        </div>

        <DbmsInfo />

        <footer
          className="text-center py-6 text-xs text-slate-500 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          Student Dropout Early-Warning System &middot; DBMS PBL Project
        </footer>
      </main>
    </div>
  );
}
