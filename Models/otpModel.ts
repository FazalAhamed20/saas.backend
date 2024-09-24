import { Schema, model } from 'mongoose';


const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    otp: {
      type: Number,
      required: true,
    },

    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Otp = model('otp', otpSchema);