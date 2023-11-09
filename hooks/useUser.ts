import { create } from "zustand";

interface UserState {
  name: string;
  email: string;
  password: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const useUser = create<UserState>((set) => ({
  name: "",
  email: "",
  password: "",
  setName: (name) => set((state) => ({ ...state, name })),
  setEmail: (email) => set((state) => ({ ...state, email })),
  setPassword: (password) => set((state) => ({ ...state, password })),
}));
