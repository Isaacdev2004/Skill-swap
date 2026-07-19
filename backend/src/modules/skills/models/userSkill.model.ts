import { Schema, model, type Document, type Types } from "mongoose";
import { SkillIntent } from "@/common/constants/enums";

export interface IUserSkill extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  skill: Types.ObjectId;
  intent: SkillIntent;
  level: string;
  yearsExperience: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSkillSchema = new Schema<IUserSkill>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true, index: true },
    intent: { type: String, enum: Object.values(SkillIntent), required: true },
    level: { type: String, required: true, trim: true },
    yearsExperience: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

userSkillSchema.index({ user: 1, skill: 1, intent: 1 }, { unique: true });
userSkillSchema.index({ intent: 1, skill: 1 });

export const UserSkillModel = model<IUserSkill>("UserSkill", userSkillSchema);
