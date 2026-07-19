import { Schema, model, type Document, type Types } from "mongoose";
import { BadgeType } from "@/common/constants/enums";

export interface IBadge extends Document {
  _id: Types.ObjectId;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema<IBadge>(
  {
    type: { type: String, enum: Object.values(BadgeType), required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    criteria: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BadgeModel = model<IBadge>("Badge", badgeSchema);

export interface IUserBadge extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  badge: Types.ObjectId;
  awardedAt: Date;
}

const userBadgeSchema = new Schema<IUserBadge>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    badge: { type: Schema.Types.ObjectId, ref: "Badge", required: true },
    awardedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

export const UserBadgeModel = model<IUserBadge>("UserBadge", userBadgeSchema);
