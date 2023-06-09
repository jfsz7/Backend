const { default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    postBy: {
      type: ObjectId,
      ref: "user",
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
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

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
