const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
    comments: 1,
    date: 1,
  });
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  res.json(user);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  if (body.password === undefined) {
    return res.status(400).json({
      error: "password is missing",
    });
  } else if (body.password.length < 3) {
    return res.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    passwordHash,
    blogs: [],
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = usersRouter;
