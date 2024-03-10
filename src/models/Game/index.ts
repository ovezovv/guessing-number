import mongoose, { Schema, Document } from 'mongoose';

interface IGame extends Document {
  players: {
    userId: Schema.Types.ObjectId;
    point: number;
    multiplier: number;
  }[];
  chatId: Schema.Types.ObjectId,
  winNumber: number;
  updatedAt: Date;
  createdAt: Date;
}

const GameSchema: Schema = new Schema({
  players: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    point: { type: Number, required: true },
    multiplier: { type: Number, required: true },

  }],
  chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
  winNumber: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
});

export const Game =  mongoose.model<IGame>('Game', GameSchema);

// export const getUsers = () =>  User.find();
// export const getUserByUsername = (username: string) => User.findOne({ username });
// export const getUserById = (id: string) => User.findById(id);
// export const createUser = (values: Record<string, any>) => new User(values).save().then((user) => user.toObject());
// export const updateUserById = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values);
// export const deleteUserById = (id: string) => User.findByIdAndDelete({ _id: id });

