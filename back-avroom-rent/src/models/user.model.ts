// Dispositivos
import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student',
}

export interface IUser extends Document {
  id?: UUIDTypes;
  username: string;
  email: string;
  password: string;
  dateCreation: Date;
  role: Role;
}

const UserSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateCreation: { type: Date, required: true },
  role: { type: String, required: true },
});

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const User = mongoose.model<IUser>('User', UserSchema);
