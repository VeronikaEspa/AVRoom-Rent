import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IMovement extends Document {
  id: UUIDTypes;
  idUser: UUIDTypes;
  idDevice: UUIDTypes;
  loanDate?: Date;
  returnDateExpected?: Date;
  description: String;
  returnDateActual?: Date;
  loanStatus: 'active' | 'returned';
}

const MovementSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, required: true },
  idUser: { type: String, required: true },
  idDevice: { type: String, required: true },
  loanDate: { type: Date, required: true },
  returnDateExpected: { type: Date, required: true },
  description: { type: String },
  returnDateActual: { type: Date },
  loanStatus: { type: String, enum: ['active', 'returned'], required: true },
});

export const Movement = mongoose.model<IMovement>('Movement', MovementSchema);
