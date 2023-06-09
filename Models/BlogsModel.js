const { default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    postBy: {
      type: ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    postImg: {
      type: String,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
