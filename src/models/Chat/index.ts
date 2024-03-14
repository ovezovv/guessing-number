import mongoose, { Schema, Document } from 'mongoose';

interface IChat extends Document {
  senderId: Schema.Types.ObjectId;
  gameId: Schema.Types.ObjectId;
  message: string;
  updatedAt: Date;
  createdAt: Date;
}

const ChatSchema: Schema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  message: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
});

export const Chat =  mongoose.model<IChat>('Chat', ChatSchema);


