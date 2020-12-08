const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  content: { type: String },
  likes: Number,
  date: Number,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  comments: [{ type: String }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

blogSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  },
})

module.exports = mongoose.model("Blog", blogSchema)
