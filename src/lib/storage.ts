import type { Student } from '@/types';
import { calculateRisk } from './risk';

const STORAGE_KEY = 'dropout-alert:students';

const demoStudents: Student[] = [
  {
    id: 'demo-1',
    name: 'Aarav Sharma',
    rollNo: 'CS21001',
    attendance: 45,
    fees: 'Pending',
    marks: 32,
    risk: calculateRisk(45, 'Pending', 32),
    createdAt: Date.now() - 5000,
  },
  {
    id: 'demo-2',
    name: 'Diya Patel',
    rollNo: 'CS21002',
    attendance: 72,
    fees: 'Pending',
    marks: 38,
    risk: calculateRisk(72, 'Pending', 38),
    createdAt: Date.now() - 4000,
  },
  {
    id: 'demo-3',
    name: 'Kabir Singh',
    rollNo: 'CS21003',
    attendance: 88,
    fees: 'Paid',
    marks: 81,
    risk: calculateRisk(88, 'Paid', 81),
    createdAt: Date.now() - 3000,
  },
  {
    id: 'demo-4',
    name: 'Ananya Rao',
    rollNo: 'CS21004',
    attendance: 55,
    fees: 'Paid',
    marks: 35,
    risk: calculateRisk(55, 'Paid', 35),
    createdAt: Date.now() - 2000,
  },
  {
    id: 'demo-5',
    name: 'Ishaan Verma',
    rollNo: 'CS21005',
    attendance: 94,
    fees: 'Paid',
    marks: 92,
    risk: calculateRisk(94, 'Paid', 92),
    createdAt: Date.now() - 1000,
  },
];

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStudents));
      return demoStudents;
    }
    const parsed = JSON.parse(raw) as Student[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    /* ignore quota errors */
  }
}

export function resetToDemo(): Student[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStudents));
  return demoStudents;
}
