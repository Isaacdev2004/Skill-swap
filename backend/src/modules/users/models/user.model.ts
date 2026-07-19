import { Schema, model, type Document, type Types } from "mongoose";
import {
  UserRole,
  UserStatus,
  BadgeType,
} from "@/common/constants/enums";

export interface AvailabilitySlot {
  day: string;
  start: string;
  end: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatarId: string;
  bio?: string;
  languages: string[];
  timezone: string;
  availability: AvailabilitySlot[];
  rating: number;
  reviewCount: number;
  badges: BadgeType[];
  verified: boolean;
  role: UserRole;
  status: UserStatus;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySchema = new Schema<AvailabilitySlot>(
  {
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, select: false },
    googleId: { type: String, sparse: true, unique: true },
    avatarId: { type: String, required: true },
    bio: { type: String, maxlength: 1000 },
    languages: { type: [String], default: ["English"] },
    timezone: { type: String, default: "UTC" },
    availability: { type: [availabilitySchema], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    badges: { type: [String], enum: Object.values(BadgeType), default: [] },
    verified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true,
    },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ rating: -1 });
userSchema.index({ createdAt: -1 });

export const UserModel = model<IUser>("User", userSchema);
