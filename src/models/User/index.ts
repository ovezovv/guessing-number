import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  points: number;
  updatedAt: Date;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  points: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
});

export const User =  mongoose.model<IUser>('User', UserSchema);

export const getUsers = () =>  User.find();
export const getUserByUsername = (username: string) => User.findOne({ username });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) => new User(values).save().then((user) => user.toObject());
export const updateUserById = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values);
export const deleteUserById = (id: string) => User.findByIdAndDelete({ _id: id });

