const express = require("express");
const { addBlog, getAllBlog, deleteBlog } = require("../../Controllers/Blog.Controllers");
const router = express.Router();

router.route("/").post(addBlog).get(getAllBlog);
router.route("/:id").delete(deleteBlog);
module.exports = router;
