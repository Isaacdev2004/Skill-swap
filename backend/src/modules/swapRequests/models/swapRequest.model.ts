import { Schema, model, type Document, type Types } from "mongoose";
import { SwapRequestStatus } from "@/common/constants/enums";

export interface ISwapRequest extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  message?: string;
  offeredSkills: Types.ObjectId[];
  requestedSkills: Types.ObjectId[];
  matchScore: number;
  status: SwapRequestStatus;
  respondedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, maxlength: 1000 },
    offeredSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    requestedSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: Object.values(SwapRequestStatus),
      default: SwapRequestStatus.PENDING,
      index: true,
    },
    respondedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

swapRequestSchema.index({ sender: 1, receiver: 1, status: 1 });
swapRequestSchema.index({ createdAt: -1 });

export const SwapRequestModel = model<ISwapRequest>("SwapRequest", swapRequestSchema);
