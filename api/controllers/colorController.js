import Color from "../models/colorModel.js";
import { errorHandler } from "../utils/error.js";

export const createColor = async (req, res, next) => {
  const { title } = req.body;
  const isAlreadyExist = await Color.findOne({ title });
  if (isAlreadyExist) {
    next(errorHandler(401, "This color already added."));
  } else {
    try {
      const newColor = await Color.create(req.body);
      res.json(newColor);
    } catch (error) {
      next(error);
    }
  }
};

export const getAllColor = async (req, res, next) => {
  try {
    const getAllColor = await Color.find();
    res.json(getAllColor);
  } catch (error) {
    next(error);
  }
};
