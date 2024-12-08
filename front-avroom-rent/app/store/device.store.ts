import {create} from "zustand";
import { Device } from '@/app/utils/types/device.types';


// Definir el tipo de estado para la store
interface DeviceState {
  devices: Device[];
  currentPage: number;
  errorMessage: string;
  setDevices: (devices: Device[]) => void;
  setCurrentPage: (page: number) => void;
  setErrorMessage: (message: string) => void;
  clearDevices: () => void;
}

// Crear la store
export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  currentPage: 1,
  errorMessage: "",
  setDevices: (devices) => set({ devices }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  clearDevices: () => set({ devices: [] }),
}));