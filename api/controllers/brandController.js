import Brand from "../models/brandModel.js";
import { errorHandler } from "../utils/error.js";

export const createBrand = async (req, res, next) => {
  const { title } = req.body;
  const isAlreadyExist = await Brand.findOne({ title });
  if (isAlreadyExist) {
    next(errorHandler(401, "This brand already added."));
  } else {
    try {
      const newBrand = await Brand.create(req.body);
      res.json(newBrand);
    } catch (error) {
      next(error);
    }
  }
};

export const getAllBrand = async (req, res, next) => {
  try {
    const getAllBrand = await Brand.find();
    res.json(getAllBrand);
  } catch (error) {
    next(error);
  }
};
