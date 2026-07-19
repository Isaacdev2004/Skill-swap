import { Schema, model, type Document, type Types } from "mongoose";
import { SessionStatus } from "@/common/constants/enums";

export interface ISession extends Document {
  _id: Types.ObjectId;
  swapRequest: Types.ObjectId;
  host: Types.ObjectId;
  participant: Types.ObjectId;
  title: string;
  description?: string;
  scheduledAt: Date;
  durationMinutes: number;
  timezone: string;
  status: SessionStatus;
  reminderSent: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    swapRequest: { type: Schema.Types.ObjectId, ref: "SwapRequest", required: true, index: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    participant: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 1000 },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 60, min: 15, max: 240 },
    timezone: { type: String, default: "UTC" },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.UPCOMING,
      index: true,
    },
    reminderSent: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

sessionSchema.index({ host: 1, scheduledAt: 1 });
sessionSchema.index({ participant: 1, scheduledAt: 1 });

export const SessionModel = model<ISession>("Session", sessionSchema);
