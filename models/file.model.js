const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    filename: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    type: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    path: {
      type: String,
      trime: true,
      lowercase: true,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["image", "video", "audio", "pdf", "other"],
      default: "other",
    },
  },
  { timestamps: true },
);

const FileModel = model("File", fileSchema);
module.exports = FileModel;
