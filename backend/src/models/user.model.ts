import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  orgName: string;
  password: string; // hashed password
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  orgName: { type: String, required: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
