import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import slugify from "slugify";
import { errorHandler } from "../utils/error.js";

export const createProduct = async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const products = await Product.find({
      ...(req.query.userRef && { userRef: req.query.userRef }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    // filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields", "searchTerm"];
    excludeFields.forEach((el) => delete queryObj[el]);
    if (req.query.searchTerm) {
      queryObj.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { description: { $regex: req.query.searchTerm, $options: "i" } },
        { category: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-sold"); // Sort by highest sold first
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-totalrating");
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-price");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount)
        next(errorHandler(404, "This page is not exits!"));
    }
    console.log(page, limit, skip);

    const product = await query;
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  const { id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            wishlist: prodId,
          },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
};

export const rating = async (req, res, next) => {
  const { id } = req.user;
  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: id,
            },
          },
        },
        {
          new: true,
        }
      );
      res.json(rateProduct);
    }

    const getAllRatings = await Product.findById(prodId);
    let totalRatings = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);

    let actualRating = (ratingSum / totalRatings).toFixed(1);

    const updatedProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (req, res, next) => {
  const { id } = req.params;
  const findProduct = await Product.findById(id);
  if (!findProduct) {
    return next(errorHandler(404, "Product not found!"));
  }
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          images: req.body.imageUrls,
        },
      },
      {
        new: true,
      }
    );
    res.json(updateProduct);
  } catch (error) {
    next(error);
  }
};
