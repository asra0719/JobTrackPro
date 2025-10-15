export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  interviewDate?: string;
  notes: string;
  url?: string;
  contactPerson?: string;
  contactEmail?: string;
}

export interface JobStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}