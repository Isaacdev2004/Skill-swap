import { Schema, model, type Document, type Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  swapRequest?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: [(v: Types.ObjectId[]) => v.length === 2, "Conversation requires exactly 2 participants"],
    },
    swapRequest: { type: Schema.Types.ObjectId, ref: "SwapRequest" },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: { type: Date, index: true },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

export const ConversationModel = model<IConversation>("Conversation", conversationSchema);

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 5000 },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

export const MessageModel = model<IMessage>("Message", messageSchema);
