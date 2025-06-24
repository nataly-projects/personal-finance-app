import mongoose, { Schema, Document } from 'mongoose';

const verificationCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const settingsSchema = new Schema({
  monthlyOutcomeLimit: {
    type: Number,
    default: null
  },
  enableOutcomeAlert: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
});

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullName: string;
  passwordUpdateCode?: {
    code: string;
    expiresAt: Date;
  };
  passwordResetCode?: {
    code: string;
    expiresAt: Date;
  };
  createdAt: Date;
  updatedAt: Date | null;
  settings?: {
    monthlyOutcomeLimit: number | null;
    enableOutcomeAlert: boolean;
    theme: 'light' | 'dark';
  };
}



const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  passwordUpdateCode: {
    type: verificationCodeSchema
  },
  passwordResetCode: {
    type: verificationCodeSchema
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  settings: {
    type: settingsSchema,
    default: {}  
  },
}, {
  timestamps: false
});

export const User = mongoose.model<UserDocument>('User', userSchema); 