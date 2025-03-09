import { create } from 'zustand';
import { Department } from '../types';

interface DepartmentState {
  departments: Department[];
  addDepartment: (name: string) => void;
  assignSenior: (departmentId: string, seniorId: string) => void;
  updateEmployeeCount: (departmentId: string, count: number) => void;
  getDepartment: (id: string) => Department | undefined;
}

const initialDepartments: Department[] = [
  {
    id: 'dev-1',
    name: 'Development',
    seniorId: null,
    employeeCount: 0,
  },
  {
    id: 'design-1',
    name: 'Design',
    seniorId: null,
    employeeCount: 0,
  },
  {
    id: 'marketing-1',
    name: 'Marketing',
    seniorId: null,
    employeeCount: 0,
  },
];

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: initialDepartments,
  addDepartment: (name) => {
    const newDepartment: Department = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      seniorId: null,
      employeeCount: 0,
    };
    set((state) => ({ departments: [...state.departments, newDepartment] }));
  },
  assignSenior: (departmentId, seniorId) => {
    set((state) => ({
      departments: state.departments.map((dept) =>
        dept.id === departmentId ? { ...dept, seniorId } : dept
      ),
    }));
  },
  updateEmployeeCount: (departmentId, count) => {
    set((state) => ({
      departments: state.departments.map((dept) =>
        dept.id === departmentId ? { ...dept, employeeCount: count } : dept
      ),
    }));
  },
  getDepartment: (id) => {
    return get().departments.find((dept) => dept.id === id);
  },
}));