import { UUIDTypes } from "uuid";

export interface Device {
  id: UUIDTypes;
  name: string;
  description: string;
  category: string;
  available: boolean;
  loanedTo?: UUIDTypes;
}