import { Schema, model, type Document, type Types } from "mongoose";
import { ReportStatus } from "@/common/constants/enums";

export interface IReport extends Document {
  _id: Types.ObjectId;
  reporter: Types.ObjectId;
  reportedUser: Types.ObjectId;
  reason: string;
  description?: string;
  status: ReportStatus;
  resolvedBy?: Types.ObjectId;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reason: { type: String, required: true },
    description: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.OPEN,
      index: true,
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolution: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

export const ReportModel = model<IReport>("Report", reportSchema);

export interface IAdminLog extends Document {
  _id: Types.ObjectId;
  admin: Types.ObjectId;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const adminLogSchema = new Schema<IAdminLog>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

adminLogSchema.index({ createdAt: -1 });

export const AdminLogModel = model<IAdminLog>("AdminLog", adminLogSchema);

export interface IVerification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  documentType: string;
  documentUrl?: string;
  notes?: string;
  status: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationSchema = new Schema<IVerification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    documentType: { type: String, required: true },
    documentUrl: { type: String },
    notes: { type: String, maxlength: 1000 },
    status: { type: String, default: "pending", index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const VerificationModel = model<IVerification>("Verification", verificationSchema);

export interface IRefreshToken extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  token: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
