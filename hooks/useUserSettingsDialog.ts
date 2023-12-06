import { create } from "zustand";

type UserSettingsDialogState = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useUserSettingsDialog = create<UserSettingsDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
