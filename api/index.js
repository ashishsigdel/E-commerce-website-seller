import express, { json } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/authRoute.js";
import productRouter from "./routes/productRoute.js";
import blogRouter from "./routes/blogRoute.js";
import productCategoryRouter from "./routes/prodCategoryRoute.js";
import blogCategoryRouter from "./routes/blogCategoryRoute.js";
import brandRouter from "./routes/brandRoute.js";
import colorRouter from "./routes/colorRoute.js";

import couponRouter from "./routes/couponRoute.js";

import morgan from "morgan";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/pcategory", productCategoryRouter);
app.use("/api/bcategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", couponRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}!!!`);
});

connectToDB();

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error!!!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
