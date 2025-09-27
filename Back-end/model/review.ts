import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  starCount: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;
