import PCategory from "../models/prodCategoryModel.js";
import { errorHandler } from "../utils/error.js";

export const createCategory = async (req, res, next) => {
  const { title } = req.body;
  const isAlreadyExist = await PCategory.findOne({ title });
  if (isAlreadyExist) {
    next(errorHandler(401, "This category already added."));
  } else {
    try {
      const newCategory = await PCategory.create(req.body);
      res.json(newCategory);
    } catch (error) {
      next(error);
    }
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const getAllCategory = await PCategory.find();
    res.json(getAllCategory);
  } catch (error) {
    next(error);
  }
};
