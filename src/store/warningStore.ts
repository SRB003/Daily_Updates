import { create } from 'zustand';
import { Warning } from '../types';
import { format } from 'date-fns';

interface WarningState {
  warnings: Warning[];
  addWarning: (userId: string, reason: string) => void;
  acknowledgeWarning: (warningId: string) => void;
  getUserWarnings: (userId: string) => Warning[];
  getDepartmentWarnings: (department: string) => Warning[];
}

export const useWarningStore = create<WarningState>((set, get) => ({
  warnings: [],
  addWarning: (userId, reason) => {
    const newWarning: Warning = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      date: format(new Date(), 'yyyy-MM-dd'),
      reason,
      acknowledged: false,
    };
    set((state) => ({ warnings: [...state.warnings, newWarning] }));
  },
  acknowledgeWarning: (warningId) => {
    set((state) => ({
      warnings: state.warnings.map((warning) =>
        warning.id === warningId ? { ...warning, acknowledged: true } : warning
      ),
    }));
  },
  getUserWarnings: (userId) => {
    return get().warnings.filter((warning) => warning.userId === userId);
  },
  getDepartmentWarnings: (department) => {
    return get().warnings.filter((warning) => {
      const user = useAuthStore.getState().users.find((u) => u.id === warning.userId);
      return user?.department === department;
    });
  },
}));