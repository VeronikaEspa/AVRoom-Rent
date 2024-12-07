import { UUIDTypes, v4 as uuidv4 } from 'uuid';
import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  id: UUIDTypes;
  name: string;
  description: string;
  category: string;
  available: boolean;
}

const DeviceSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
});

export const Device = mongoose.model<IDevice>('Device', DeviceSchema);
