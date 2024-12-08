import { create } from "zustand";
import { User } from "../utils/types/user.types";

interface UserState {
  users: User[];
  currentPage: number;
  errorMessage: string;
  setUsers: (users: User[]) => void;
  setCurrentPage: (page: number) => void;
  setErrorMessage: (message: string) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentPage: 1,
  errorMessage: "",
  setUsers: (users) => set({ users }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  clearUsers: () => set({ users: [] }),
}));