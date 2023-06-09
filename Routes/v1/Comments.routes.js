const express = require("express");
const {
  addComments, getCommentByPostId,deleteComment
} = require("../../Controllers/Comments.Controllers");
const router = express.Router();

router.route("/").post(addComments);
router.route("/getCommentByPostId/:id").get(getCommentByPostId);
router.route('/:id').delete(deleteComment)
module.exports = router;
