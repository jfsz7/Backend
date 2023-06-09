const Comment = require("../Models/CommentsModel");
const Post = require("../Models/PostModel");
const user = require("../Models/UserModel");

module.exports.getCommentByPostId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Comment.find({ postId: id })
      .populate(["commentedBy"])
      .sort("-createdAt");
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Comments fetched successfully by post id",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to get Comment by post id",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.addComments = async (req, res) => {
  try {
    const data = req.body;
    const result = await Comment.create(data);
    const checkPost = await Post.findById(data.postId).populate("postBy");
    if (result) {
      const updatePost = await Post.findByIdAndUpdate(checkPost?._id, {
        comments: checkPost?.comments + 1,
      });
      const updateUser = await user.findByIdAndUpdate(checkPost?.postBy?._id, {
        comments: [...checkPost?.postBy?.comments, data.postId],
      });
      res.status(200).json({
        status: true,
        result: result,
        message: "Comment created successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to add Comment",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const checkComment = await Comment.findById(id);
    const result = await Comment.findByIdAndDelete(id);
    const checkPost = await Post.findById(checkComment?.postId).populate(
      "postBy"
    );
    if (result) {
      const newComments = checkPost?.comments - 1;
      //   console.log(newComments);
      const updatePost = await Post.findByIdAndUpdate(checkPost?._id, {
        comments: newComments,
      });
      //   const filter = checkPost?.postBy?.comments?.filter(
      //     (c) => c !== checkPost._id.toString()
      //   );
      let count = 0;
      const filter = [];
      for (const i of checkPost?.postBy?.comments) {
        if (i === checkPost._id.toString() && count === 0) {
          count = count + 1;
        } else {
          filter.push(i);
        }
      }
      const updateUser = await user.findByIdAndUpdate(checkPost.postBy._id, {
        comments: filter,
      });
      res.status(200).json({
        status: true,
        result: result,
        message: "Comment deleted successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to delete Comment!",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};
