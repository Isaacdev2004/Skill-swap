import { Schema, model, type Document, type Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  reviewer: Types.ObjectId;
  reviewee: Types.ObjectId;
  session: Types.ObjectId;
  rating: number;
  communication: number;
  knowledge: number;
  recommend: boolean;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reviewee: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    session: { type: Schema.Types.ObjectId, ref: "Session", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    communication: { type: Number, required: true, min: 1, max: 5 },
    knowledge: { type: Number, required: true, min: 1, max: 5 },
    recommend: { type: Boolean, default: true },
    comment: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewee: 1, createdAt: -1 });

export const ReviewModel = model<IReview>("Review", reviewSchema);
