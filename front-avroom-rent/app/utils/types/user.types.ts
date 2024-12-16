import { UUIDTypes } from 'uuid';

export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student',
}

export interface IUser {
  id: UUIDTypes;
  username: string;
  email: string;
  password: string;
  dateCreation: Date;
  role: Role;
  isActive: boolean;
}