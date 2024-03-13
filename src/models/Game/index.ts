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
  winNumber: { type: Number },
  updatedAt: { type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
});

export const Game =  mongoose.model<IGame>('Game', GameSchema);


