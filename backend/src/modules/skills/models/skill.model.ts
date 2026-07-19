import { Schema, model, type Document, type Types } from "mongoose";

export interface ISkill extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  category: Types.ObjectId;
  description?: string;
  icon?: string;
  popularity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    description: { type: String, maxlength: 1000 },
    icon: { type: String },
    popularity: { type: Number, default: 0, min: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

skillSchema.index({ name: "text", description: "text" });

export const SkillModel = model<ISkill>("Skill", skillSchema);
