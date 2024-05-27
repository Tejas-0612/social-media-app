import mongoose, { Schema } from "mongoose";

const userSettingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const userSetting = mongoose.model("UserSetting", userSettingSchema);
