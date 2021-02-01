const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.set("toJSON", { virtuals: true });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/h_0.7,c_scale");
});

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  likes: Number,
  date: Number,
  images: [ImageSchema],
  comments: [{ type: String }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
