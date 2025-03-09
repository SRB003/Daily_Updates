import { create } from 'zustand';
import { DailyUpdate } from '../types';
import { format } from 'date-fns';

interface UpdateState {
  updates: DailyUpdate[];
  addUpdate: (name: string, content: string, department: string, role: string) => void;
  getUpdatesByDepartment: (department: string) => DailyUpdate[];
  getAllUpdates: () => DailyUpdate[];
}

export const useUpdateStore = create<UpdateState>((set, get) => ({
  updates: [],
  addUpdate: (name, content, department, role) => {
    const newUpdate: DailyUpdate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      content,
      department,
      role,
      date: format(new Date(), 'yyyy-MM-dd'),
      submissionTime: new Date().toISOString(),
    };
    set((state) => ({ updates: [...state.updates, newUpdate] }));
  },
  getUpdatesByDepartment: (department) => {
    if (department === 'all') {
      return get().updates;
    }
    return get().updates.filter((update) => update.department === department);
  },
  getAllUpdates: () => {
    return get().updates;
  },
}));