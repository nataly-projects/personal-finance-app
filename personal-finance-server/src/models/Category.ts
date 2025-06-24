import mongoose, { Schema, Document } from 'mongoose';
import { Category as CategoryType } from '@shared/types/category';

export interface CategoryDocument extends Document, 
  Omit<CategoryType, 'id' | 'userId'> {
  userId: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<CategoryDocument>({
  name: {
    type: String,
    required: true,
    trim: true
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

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema); 