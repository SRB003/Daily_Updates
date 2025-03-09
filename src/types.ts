export interface User {
  id: string;
  name: string;
  password: string;
  mobile: string;
  department: string;
  role: 'admin' | 'senior' | 'developer' | 'manager' | 'ceo';
  warningCount: number;
  registeredDate: string;
}

export interface DailyUpdate {
  id: string;
  name: string;
  content: string;
  date: string;
  department: string;
  role: string;
  submissionTime: string;
}

export interface Department {
  id: string;
  name: string;
  seniorId: string | null;
  employeeCount: number;
}

export interface Warning {
  id: string;
  userId: string;
  date: string;
  reason: string;
  acknowledged: boolean;
}