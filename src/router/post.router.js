const express = require("express");
const post = require("../controllers/post");
const uploads = require("../middleware/multer");
const { upload } = require("../../config/cludinary");
const router = express.Router();

router.get("/get_post", post.getAllPost);
router.get("/:id", post.getSinglePost);
router.delete("/:postId", post.deletePost);
router.post(
  "/create-post",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  post.createPost,
);

router.put(
  "/:postId",
  uploads.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  post.updatePost,

  router.put(
    "/:postId/images/:imageId",
    uploads.fields([{ name: "images", maxCount: 1 }]),
    post.updateOrDeleteImage,
  ),
);
module.exports = router;
