const express = require("express");
const {
  addPost,
  deletePost,
  updatePostById,
  getPostByUserId,
  getAllPost,
} = require("../../Controllers/Post.Controller");
const router = express.Router();

router.route("/").post(addPost);
router.route('/getAllPost').post(getAllPost)
router.route("/getPostByUserId/:id").get(getPostByUserId);
router.route("/:id").patch(updatePostById).delete(deletePost);
module.exports = router;
