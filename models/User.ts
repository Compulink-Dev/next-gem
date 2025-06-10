// models/User.ts
import { Schema, model, Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define Mongoose interface manually (not with Zod)
export interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  tenants: string[];
  currentTenant?: Types.ObjectId | null;
}

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  tenants: [{ type: String, default: [] }],
  currentTenant: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.method('comparePassword', async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

export const User = model<IUser, UserModel>('User', userSchema);
