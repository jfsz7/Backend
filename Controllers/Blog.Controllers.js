const Blog = require("../Models/BlogsModel");
const Comment = require("../Models/CommentsModel");
const Post = require("../Models/PostModel");
const user = require("../Models/UserModel");

module.exports.getAllBlog = async (req, res) => {
  try {
    let  result = await Blog.find({})
    .populate(["postBy"])
    .sort("-createdAt");;
    
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Blogs fetched successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to get Blogs!",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};



module.exports.addBlog = async (req, res) => {
  try {
    const data = req.body;
    const result = await Blog.create(data);
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Blog created successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to create Blog",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id)
    const result = await Blog.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Blog deleted successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to delete Blog!",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports.updatePostById = async (req, res) => {
  try {
    const data = req.body;
    const { task, userId } = data;
    const id = req.params.id;
    const post = await Post.findById(id);
    const userCheck = await user.findById(userId);
    // console.log(userCheck);
    let result;
    if (task === "addLike") {
      const newLike = post.likes + 1;
      result = await Post.findByIdAndUpdate(id, { likes: newLike });
      if (result) {
        const updateUser = await user.findByIdAndUpdate(userCheck?._id, {
          likes: [...userCheck.likes, id],
        });
        res.status(200).json({
          status: true,
          result: result,
          message: "Post Liked!",
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Failed to Like",
        });
      }
    } else if (task === "removeLike") {
      const newLike = post.likes - 1;
      result = await Post.findByIdAndUpdate(id, { likes: newLike });
      if (result) {
        const filtered = userCheck?.likes?.filter((l) => l !== id);
        const updateUser = await user.findByIdAndUpdate(userCheck?._id, {
          likes: filtered,
        });
        res.status(200).json({
          status: true,
          result: result,
          message: "Post Unliked!",
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Failed to Unlike",
        });
      }
    }
     else if (task === "addComments") {
      const {commentBody, commentedBy, postId} = req.body
      const newComment = post.comments + 1;
        result = await Post.findByIdAndUpdate(id, { comments: newComment });
        console.log(result)
        result = await Comment.create({commentBody, commentedBy, postId})
        if (result) {
          const filtered = userCheck?.comments?.filter((l) => l !== id);
          const updateUser = await user.findByIdAndUpdate(userCheck?._id, {
            comments: filtered,
          });
          res.status(200).json({
            status: true,
            result: result,
            message: "Post commented!",
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Failed to comment",
          });
        }
    }

  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.getPostByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Post.find({ postBy: id })
      .populate(["postBy"])
      .sort("-createdAt");
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "posts fetched by UserId successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to get posts by UserId!",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};
