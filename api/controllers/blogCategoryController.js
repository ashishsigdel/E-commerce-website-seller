import blogCategory from "../models/blogCategoryModel.js";
import { errorHandler } from "../utils/error.js";

export const createCategory = async (req, res, next) => {
  try {
    const newCategory = await blogCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkID = await blogCategory.findById(id);
    if (!checkID) return next(errorHandler(404, "Category not found!"));

    const updateCategory = await blogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkID = await blogCategory.findById(id);
    if (!checkID) return next(errorHandler(404, "Category not found!"));

    const deleteCategory = await blogCategory.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkID = await blogCategory.findById(id);
    if (!checkID) return next(errorHandler(404, "Category not found!"));
    const getCategory = await blogCategory.findById(id);
    res.json(getCategory);
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const getAllCategory = await blogCategory.find();
    res.json(getAllCategory);
  } catch (error) {
    next(error);
  }
};
