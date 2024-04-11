import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendEmail } from "./emailController.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";

import uniqid from "uniqid";

export const test = async (req, res) => {
  res.json("hello world");
};

export const createUser = async (req, res, next) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });
    try {
      await newUser.save();
      res.status(201).json("User created successfully..");
    } catch (error) {
      res.status(500).json(error.message);
      next(error);
    }
  } else {
    return next(errorHandler(422, "User already exits!"));
  }
};

export const createAdmin = async (req, res, next) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser) {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      role: "admin",
    });
    try {
      await newUser.save();
      res.status(201).json("User created successfully..");
    } catch (error) {
      res.status(500).json(error.message);
      next(error);
    }
  } else {
    return next(errorHandler(422, "Seller already exits with that email!"));
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) return next(errorHandler(404, "User not found!"));

    if (findUser.role == "user") {
      const validPassword = bcryptjs.compareSync(password, findUser.password);
      if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));

      const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = findUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      return next(
        errorHandler(
          400,
          "This email belogs to seller account. Please choose different account to shop."
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { firstName, lastName, email, profilePic, mobile } = req.body;
  try {
    const findUser = await User.findOne({ email });
    console.log(findUser);
    if (!findUser) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profilePic,
        mobile,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = findUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const findAdmin = await User.findOne({ email });
    if (!findAdmin) return next(errorHandler(404, "Seller not found!"));

    if (findAdmin.role == "admin") {
      const validPassword = bcryptjs.compareSync(password, findAdmin.password);
      if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));

      const token = jwt.sign({ id: findAdmin._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = findAdmin._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      return next(errorHandler(401, "Unauthorized!"));
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          mobile: req.body.mobile,
          profilePic: req.body.profilePic,
          address: req.body.address,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const saveAddress = async (req, res, next) => {
  const { id } = req.user;
  const findUser = await User.findById(id);
  if (!findUser) return next(errorHandler(404, "User not found!"));
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        address: req.body.address,
      },
    },
    { new: true }
  );
  res.json(updateUser);
};

export const getAllUser = async (req, res, next) => {
  try {
    const getAllUser = await User.find();
    res.json(getAllUser);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    return next(errorHandler(404, "Id is not exits or valid."));
  } else {
    try {
      const getaUser = await User.findById(id);
      res.json({
        getaUser,
      });
    } catch (error) {
      next(error);
    }
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return next(errorHandler(404, "Id is not exits or valid."));
  } else {
    try {
      const data = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          isBlocked: true,
        },
      });
      res.json({
        message: "user blocked.",
      });
    } catch (error) {
      next(error);
    }
  }
};

export const unblockUser = async (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isValid) {
    return next(errorHandler(404, "Id is not exits or valid."));
  } else {
    try {
      const data = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          isBlocked: false,
        },
      });
      res.json({
        message: "user unblocked.",
      });
    } catch (error) {
      next(error);
    }
  }
};

export const logOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(201).json("User logged out!");
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordToken = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(errorHandler(404, "User not found!"));

  console.log(user);

  try {
    const generatedToken = Math.random().toString(36).slice(-6);
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          passwordResetToken: generatedToken,
          passwordResetExpires: passwordResetExpires,
        },
      },
      { new: true }
    );

    const resetURL = `<html>
    <head>
    <style>
    .otp {
      display: flex;
      gap: 20px;
    }
    .otp p {
      font-size: 40px;
      color: blue;
    }
  </style>
    </head>
    <body>
    <div class="container">
    <h1>Password Reset OTP</h1>
    <p>Hi there!</p>
    <p>
      Please use the following OTP to reset your password. This OTP is valid
      only for 10 minutes.
    </p>
    <div class="otp">
      <h1>OTP:</h1>
      <p>${generatedToken}</p>
    </div>
    <p>
      If you didn't request this password reset, please ignore this email.
    </p>
  </div>
    </body>
  </html>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password OTP",
      htm: resetURL,
    };

    sendEmail(data);

    res.json({ message: "OTP sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const { token } = req.params;

    const findUser = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!findUser) {
      if (!findUser) return next(errorHandler(401, "Wrong OTP!"));
    }
    const update = await User.findByIdAndUpdate(
      findUser.id,
      {
        $set: {
          password: hashedPassword,
          passwordResetToken: undefined,
          passwordResetExpires: undefined,
        },
      },
      { new: true }
    );
    if (update) {
      res.json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    next(error);
  }
};

export const userCart = async (req, res, next) => {
  const { cart } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);

  if (!user) return next(errorHandler(404, "User not found!"));

  try {
    let products = [];
    let cartTotal = 0;

    const existingCart = await Cart.findOne({ orderBy: user.id });

    if (existingCart) {
      for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i].id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let getPrice = await Product.findById(cart[i].id)
          .select("price")
          .exec();
        object.price = getPrice.price;
        products.push(object);

        // Update existing product in the cart if it already exists
        const existingProductIndex = existingCart.products.findIndex(
          (item) => item.product.toString() === cart[i].id
        );

        if (existingProductIndex !== -1) {
          existingCart.products[existingProductIndex].count += cart[i].count;
        } else {
          // Add the new product to the existing cart
          existingCart.products.push(object);
        }
      }

      // Recalculate cartTotal
      for (let i = 0; i < existingCart.products.length; i++) {
        cartTotal +=
          existingCart.products[i].price * existingCart.products[i].count;
      }

      existingCart.cartTotal = cartTotal;

      await existingCart.save();
      res.json(existingCart);
    } else {
      // Create a new cart if one doesn't exist
      for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i].id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let getPrice = await Product.findById(cart[i].id)
          .select("price")
          .exec();
        object.price = getPrice.price;
        products.push(object);
        cartTotal += object.price * object.count;
      }

      let newCart = await new Cart({
        products,
        cartTotal,
        orderBy: user?.id,
      }).save();

      res.json(newCart);
    }
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found!"));

    // Check if there is an existing cart for the user
    const existingCart = await Cart.findOne({ orderBy: user.id });

    if (!existingCart) {
      return next(errorHandler(404, "Product not found!"));
    }

    // Find the index of the product in the cart
    const productIndex = existingCart.products.findIndex((product) =>
      product.product.equals(productId)
    );

    if (productIndex !== -1) {
      // Remove the product from the cart
      existingCart.products.splice(productIndex, 1);

      // Recalculate cartTotal
      existingCart.cartTotal = existingCart.products.reduce(
        (total, product) => total + product.price * product.count,
        0
      );

      // Save the updated cart
      await existingCart.save();

      return res.json(existingCart);
    } else {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserCart = async (req, res, next) => {
  const { id } = req.user;
  const findUser = await User.findById(id);
  if (!findUser) return next(errorHandler(404, "User not found!"));

  try {
    const cart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const cart = await Cart.findOneAndDelete({ orderBy: user.id });

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  const { coupon } = req.body;
  const { id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) return next(errorHandler(401, "Coupon not accepted!"));

  const user = await User.findOne({ id });
  let { products, cartTotal } = await Cart.findOne({
    orderBy: id,
  }).populate("products.product");
  let totalAfterDiscount =
    cartTotal - ((cartTotal * validCoupon.discount) / 100).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderBy: id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
};

export const createOrder = async (req, res, next) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;
  try {
    if (!COD) return new (errorHandler(400, "Create cash order failed!"))();

    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderBy: user.id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "Rs.",
      },
      orderBy: user.id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  const { id } = req.user;
  const findUser = await User.findById(id);
  if (!findUser) return next(errorHandler(404, "User not found!"));

  try {
    const order = await Order.find({ orderBy: id }).populate(
      "products.product"
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersById = async (req, res, next) => {
  const { id } = req.user;
  const { orderId } = req.params;

  const findUser = await User.findById(id);
  if (!findUser) {
    return next(errorHandler(404, "User not found!"));
  }

  try {
    const orders = await Order.findById(orderId).populate("products.product");

    res.json(orders);
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  const { id } = req.user;
  const findUser = await User.findById(id);

  if (!findUser) {
    return next(errorHandler(404, "User not found!"));
  }

  try {
    const orders = await Order.find().populate("products.product");

    // Filter orders based on userRef
    const filteredOrders = orders.filter((order) =>
      order.products.some(
        (product) => product.product.userRef.toString() === id.toString()
      )
    );

    res.json(filteredOrders);
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const checkOrder = await Order.findById(id);
  if (!checkOrder) return next(errorHandler(404, "Order not found!"));
  if (checkOrder.orderStatus === "Cancelled") {
    return next(errorHandler(401, "Order has been already cancelled!"));
  } else {
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          $set: {
            orderStatus: status,
            "paymentIntent.status": status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error) {
      next(error);
    }
  }
};

export const cancelOrder = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const checkOrder = await Order.findById(id);
  if (!checkOrder) return next(errorHandler(404, "Order not found!"));

  if (
    checkOrder.orderStatus === "Processing" ||
    checkOrder.orderStatus === "Cash on Delivery" ||
    checkOrder.orderStatus === "Not Processed"
  ) {
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          $set: {
            orderStatus: status,
            "paymentIntent.status": status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can't cancel order now!"));
  }
};
