const Comment = require("../Models/CommentsModel");
const Notification = require("../Models/NotificationModel");
const Post = require("../Models/PostModel");
const user = require("../Models/UserModel");

module.exports.getAllPost = async (req, res) => {
  try {
    const {filter} = req.body;
    let result;
    if(filter === 'all'){
      result = await Post.find({})
      .populate(["postBy"])
      .sort("-createdAt");
    }else if(filter === 'new'){
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);
       result = await Post.aggregate([
        {
          $match: { createdAt: { $gte: sevenDaysAgo }, likes: { $exists: true } },
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'users', // Replace 'users' with the actual related collection name
            localField: 'postBy', // The field in the current collection to match
            foreignField: '_id', // The field in the related collection to match
            as: 'populatedField' // The field to store the populated data
          }
        },
        { $unwind: '$populatedField' }, // Optional, if you want to unwind the populated array
      ]).exec();
    }else if(filter === 'top'){
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
       result = await Post.aggregate([
        {
          $match: { createdAt: { $gte: sevenDaysAgo }, likes: { $exists: true } },
        },
        { $sort: { likes: -1 } },
        {
          $lookup: {
            from: 'users', // Replace 'users' with the actual related collection name
            localField: 'postBy', // The field in the current collection to match
            foreignField: '_id', // The field in the related collection to match
            as: 'populatedField' // The field to store the populated data
          }
        },
        { $unwind: '$populatedField' }, // Optional, if you want to unwind the populated array
      ]).exec();
    }else if(filter === 'hot'){
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);
       result = await Post.aggregate([
        {
          $match: { createdAt: { $gte: sevenDaysAgo }, likes: { $exists: true } },
        },
        { $sort: { likes: -1 } },
        {
          $lookup: {
            from: 'users', // Replace 'users' with the actual related collection name
            localField: 'postBy', // The field in the current collection to match
            foreignField: '_id', // The field in the related collection to match
            as: 'populatedField' // The field to store the populated data
          }
        },
        { $unwind: '$populatedField' }, // Optional, if you want to unwind the populated array
      ]).exec();
    }
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Post fetched successfully by circleId!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to get Post by circleId!",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};



module.exports.addPost = async (req, res) => {
  try {
    const data = req.body;
    const result = await Post.create(data);
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Post created successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to create Post",
      });
    }
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id)
    const result = await Post.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: true,
        result: result,
        message: "Post deleted successfully!",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Failed to delete Post!",
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
        const notification = await Notification.create({ message: `${userCheck?.username} has liked your post!`, recipient: post?.postBy?._id });
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
        const notification = await Notification.create({ message: `${userCheck?.username} has disliked your post!`, recipient: post?.postBy?._id });

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
          const notification = await Notification.create({ message: `${userCheck?.username} has commented on your post!`, recipient: post?.postBy?._id });

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
