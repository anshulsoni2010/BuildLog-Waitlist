import mongoose from "mongoose";

export interface IWaitlistUser extends mongoose.Document {
  email: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  verifiedAt?: Date;
  resendCount: number;
}

const waitlistUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: Date,
  resendCount: {
    type: Number,
    default: 0,
  },
});

const WaitlistUser = mongoose.models.WaitlistUser || mongoose.model("WaitlistUser", waitlistUserSchema);

export default WaitlistUser;
