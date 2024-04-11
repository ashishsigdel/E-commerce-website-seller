import mongoose from "mongoose";

const prodCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const PCategory = mongoose.model("PCategory", prodCategorySchema);

export default PCategory;
