import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "e-commerce",
    });
    console.log("Connected to mongoDB.");
  } catch (error) {
    console.log(error);
  }
};
