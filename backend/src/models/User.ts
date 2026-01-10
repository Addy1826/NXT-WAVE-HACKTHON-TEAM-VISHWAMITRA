import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'patient' | 'therapist' | 'admin';
  googleId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['patient', 'therapist', 'admin'], default: 'patient' },
  googleId: { type: String },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
