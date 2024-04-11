import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const createBlog = async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      newBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkId = await Blog.findById(id);
    if (!checkId) return next(errorHandler(404, "Blog not found!"));
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      updateBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkId = await Blog.findById(id);
    if (!checkId) return next(errorHandler(404, "Blog not found!"));
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes")
      .lean();
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    next(error);
  }
};

export const getAllBlog = async (req, res, next) => {
  try {
    const getAllBlog = await Blog.find();
    res.json(getAllBlog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkId = await Blog.findById(id);
    if (!checkId) return next(errorHandler(404, "Blog not found!"));
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      deleteBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const likeBlog = async (req, res, next) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user.id;

  const isLiked = blog?.isLiked;

  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  console.log("alreadydisliked", alreadyDisliked);

  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

export const dislikeBlog = async (req, res, next) => {
  const { blogId } = req.body;
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user.id;

  const isDisliked = blog?.isDisliked;

  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

// export const uploadImages = async (req, res, next) => {
//   const { id } = req.params;
//   const findBlog = await Blog.findById(id);
//   if (!findBlog) {
//     return next(errorHandler(404, "Blog not found!"));
//   }

//   try {
//     const uploader = async (path) => await cloudinaryUploadImg(path);

//     const urls = [];
//     const files = req.files;

//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       urls.push(newPath);

//       fs.unlink(path);
//     }

//     const updateBlog = await Blog.findByIdAndUpdate(
//       id,
//       {
//         image: urls.map((file) => {
//           return file.url;
//         }),
//       },
//       { new: true }
//     );

//     res.json(updateBlog);
//   } catch (error) {
//     next(error);
//   }
// };
