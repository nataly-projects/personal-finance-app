import mongoose, { Schema, Document } from 'mongoose';
import { Task as TaskType } from '@shared/types/task';

export interface TaskDocument extends Document, 
Omit<TaskType, 'id' | 'userId'> {
  userId: Schema.Types.ObjectId;
}

const taskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: false
});

export const Task = mongoose.model<TaskDocument>('Task', taskSchema); 