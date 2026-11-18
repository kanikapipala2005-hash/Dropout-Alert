export type RiskLevel = 'HIGH' | 'MEDIUM' | 'SAFE';

export type FeesStatus = 'Paid' | 'Pending';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  fees: FeesStatus;
  marks: number;
  risk: RiskLevel;
  createdAt: number;
}
