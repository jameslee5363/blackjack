import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DSN);
console.log("Database connected");

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // Hashed password 
  balance: { type: Number, default: 1000 }, // user's balance 
});

const User = mongoose.model('User', UserSchema);

// game Schema
const GameSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  result: { type: String, enum: ['win', 'lose', 'push'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', GameSchema);

export { User, Game };
