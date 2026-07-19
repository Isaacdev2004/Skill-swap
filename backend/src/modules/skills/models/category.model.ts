import { Schema, model, type Document, type Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, maxlength: 500 },
    icon: { type: String },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
