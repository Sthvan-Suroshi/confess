import mongoose, { Schema, Document } from "mongoose";

//extends Document is used to refer that it is part of mongoose document
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

// export default mongoose.model<Message>("Message", messageSchema);

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  password: { type: String, required: [true, "Password is required."] },
  verifyCode: { type: String, required: [true, "Verify code is required."] },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required."],
  },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [messageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
