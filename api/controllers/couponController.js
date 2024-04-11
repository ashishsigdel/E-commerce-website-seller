import Coupon from "../models/couponModel.js";
import { errorHandler } from "../utils/error.js";

export const createCoupon = async (req, res, next) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    next(error);
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  const { id } = req.params;
  const findCoupon = await Coupon.findById(id);
  if (!findCoupon) return next(errorHandler(404, "Coupon not found!"));
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCoupon);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  const { id } = req.params;
  const findCoupon = await Coupon.findById(id);
  if (!findCoupon) return next(errorHandler(404, "Coupon not found!"));
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deleteCoupon);
  } catch (error) {
    next(error);
  }
};
