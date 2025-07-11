import { create } from 'zustand';

type Role = 'parent' | 'teacher' | 'admin';

interface RoleStore {
  currentRole: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  currentRole: 'parent',
  setRole: (role: Role) => set({ currentRole: role }),
}));