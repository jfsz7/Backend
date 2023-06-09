const { default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = mongoose.Schema(
  {
    commentBody: {
      type: String,
      required: true,
    },
    commentedBy: {
      type: ObjectId,
      ref: "user",
    },
    postId: {
      type: ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
