import mongoose, { Schema, Document } from 'mongoose';

interface IGame extends Document {
  players: {
    username: string;
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
    username: { type: String, required: true },
    point: { type: Number, required: true },
    multiplier: { type: Number, required: true },
  }],
  winNumber: { type: Number },
  updatedAt: { type: Date, default: Date.now},
  createdAt: { type: Date, default: Date.now },
});

export const Game =  mongoose.model<IGame>('Game', GameSchema);


