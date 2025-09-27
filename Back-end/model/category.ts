import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    enum: ["Type", "Difficulty", "Activity"],
    required: true,
  },
  icons: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});
const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
