import { UUIDTypes } from 'uuid';

export enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  SUPER_ADMIN = 'superAdmin',
}

export interface User {
  id: UUIDTypes;
  username: string;
  email: string;
  password: string;
  dateCreation: Date;
  role: Role;
}