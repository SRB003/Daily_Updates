import { create } from 'zustand';
import { User } from '../types';
import { format } from 'date-fns';

interface AuthState {
  user: User | null;
  users: User[];
  login: (credentials: { name: string; password: string }) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'warningCount' | 'registeredDate'>) => boolean;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'admin',
    password: 'admin123',
    mobile: '1234567890',
    department: 'all',
    role: 'admin',
    warningCount: 0,
    registeredDate: '2024-03-15',
  },
  {
    id: '2',
    name: 'ceo',
    password: 'ceo123',
    mobile: '0987654321',
    department: 'all',
    role: 'ceo',
    warningCount: 0,
    registeredDate: '2024-03-15',
  },
  {
    id: '3',
    name: 'designer1',
    password: 'design123',
    mobile: '1112223333',
    department: 'design-1',
    role: 'developer',
    warningCount: 0,
    registeredDate: '2024-03-15',
  },
  {
    id: '4',
    name: 'developer1',
    password: 'dev123',
    mobile: '4445556666',
    department: 'dev-1',
    role: 'developer',
    warningCount: 0,
    registeredDate: '2024-03-15',
  },
  {
    id: '5',
    name: 'seniordev',
    password: 'senior123',
    mobile: '7778889999',
    department: 'dev-1',
    role: 'senior',
    warningCount: 0,
    registeredDate: '2024-03-15',
  },
  {
    id: '6',
    name: 'seniordesign',
    password: 'senior123',
    mobile: '0001112222',
    department: 'design-1',
    role: 'senior',
    warningCount: 0,
    registeredDate: '2024-03-15',
  }
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  users: initialUsers,
  login: (credentials) => {
    const user = get().users.find(
      (u) => u.name === credentials.name && u.password === credentials.password
    );
    if (user) {
      set({ user });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
  register: (userData) => {
    const users = get().users;
    if (users.some((u) => u.name === userData.name)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      warningCount: 0,
      registeredDate: format(new Date(), 'yyyy-MM-dd'),
    };

    set({ users: [...users, newUser] });
    return true;
  },
}));