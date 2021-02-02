const blogsRouter = require("express").Router();
const { request, response } = require("express");
const blog = require("../models/blog");
const Blog = require("../models/blog");
const User = require("../models/user");
const usersRouter = require("./users");
const jwt = require("jsonwebtoken");
const { storage } = require("../cloudinary");
const multer = require("multer");
const { conforms } = require("lodash");
const upload = multer({ storage });

//      / =  /api/blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1 });
  response.status(201).json(blogs);
});

blogsRouter.post("/", upload.array("files"), async (request, response) => {
  const { title, content, date } = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title,
    content,
    likes: [],
    images:
      request.files.map((f) => ({ url: f.path, filename: f.filename })) || [],
    date,
    user: user,
    comments: [],
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blogToDelete = await Blog.findById(request.params.id);

  if (blogToDelete === null) {
    return response.status(400).json({ error: "Blog not exist" });
  }

  if (blogToDelete.user.toString() === user.id) {
    await Blog.findByIdAndDelete(request.params.id);

    user.blogs = user.blogs.filter((blog) => {
      return blogToDelete.id.toString() !== blog.id.toString();
    });

    await user.save();

    response.status(204).end();
  } else {
    response.status(401).json({ error: "Unauthorized Deletion" });
  }
});

blogsRouter.put("/:id/like", async (request, response) => {
  const body = request.body;
  const likedUser = await User.findById(body.userID).select("username _id");

  const blog = await Blog.findById(request.params.id);
  const newBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      likes: [...blog.likes, likedUser],
    },
    {
      new: true,
    }
  )
    .populate("user", { username: 1 })
    .populate("likes", { username: 1 });
  response.json(newBlog.toJSON());
});

// update only the like field
blogsRouter.put("/:id/unlike", async (request, response) => {
  const body = request.body;

  const unlikedUser = await User.findById(body.userID).select("username _id");
  const blog = await Blog.findById(request.params.id).populate("likes");

  const newBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      likes: [
        ...blog.likes.filter((likeUser) => {
          return likeUser.username !== unlikedUser.username;
        }),
      ],
    },
    {
      new: true,
    }
  )
    .populate("user", { username: 1 })
    .populate("likes", { username: 1 });
  response.json(newBlog.toJSON());
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const body = request.body;

  const currentBlog = await Blog.findById(request.params.id).lean();
  const updatedBlog = {
    ...currentBlog,
    comments: [...currentBlog.comments, body.comment],
  };
  const newBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  }).populate("user", { username: 1 });

  response.json(newBlog.toJSON());
});

module.exports = blogsRouter;
