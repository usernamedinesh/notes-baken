const Post = require("../models/Post");
const { cloudinary } = require("../../config/cludinary");

//get all posts
exports.getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("title thumbnail createdAt _id")
      .populate("images");
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No post found!" });
    }
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
      totalPost: posts.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create posts
exports.createPost = async (req, res) => {
  try {
    const { title } = req.body;

    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    const thumbnailFile = req.files?.thumbnail?.[0];
    const thumbnail = thumbnailFile?.path || null;

    console.log("thumbnail", thumbnail);
    console.log("title", title);
    if (!title) {
      return res.status(400).json({ error: "Fields 'title' are required." });
    }
    if (!thumbnail) {
      return res
        .status(400)
        .json({ error: "Fields 'thumbnail' are required." });
    }
    // Handle images
    let images = [];
    if (Array.isArray(req.files?.images)) {
      images = req.files.images.map((file) => ({
        url: file.path,
      }));
    }

    console.log("heloo2");
    // Validation

    console.log("heloo3");
    // Create post
    const newPost = new Post({
      title,
      thumbnail,
      images,
    });
    await newPost.save();
    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(403).json({ error: "Invalid post Id" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(402).json({ error: "Post not found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "fetched single post", data: post });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Update thumbnail if provided (assuming multer uploads it directly to Cloudinary)
    if (req.files?.thumbnail && req.files.thumbnail.length > 0) {
      post.thumbnail = req.files.thumbnail[0].path;
    }

    // Helper to upload buffer to Cloudinary
    const uploadImage = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(buffer);
      });

    // Add new images if provided (upload buffers in parallel)
    if (req.files?.images && req.files.images.length > 0) {
      const uploadPromises = req.files.images.map((file) =>
        uploadImage(file.buffer),
      );
      const results = await Promise.all(uploadPromises);

      const newImages = results.map((result) => ({
        url: result.secure_url,
        caption: req.body.captions || "",
      }));

      post.images.push(...newImages);
    }

    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Error updating post images:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    // 1. Find the post first
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 2. Delete from Cloudinary (if image exists)
    if (post.cloudinaryId) {
      await cloudinary.uploader.destroy(post.cloudinaryId);
    }

    // 3. Delete from MongoDB
    await Post.findByIdAndDelete(postId);

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrDeleteImage = async (req, res) => {
  const { postId, imageId } = req.params;
  const { deleteImage } = req.body; // `deleteImage` will determine if we delete the image
  const newImageFile = req.files?.image ? req.files.image[0] : null;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Find the image by imageId within the images array
    const image = post.images.id(imageId);
    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }
    // If `deleteImage` is true, delete the image from Cloudinary and remove it from the array
    if (deleteImage) {
      const publicId = image.url.split("/").pop().split(".")[0]; // Extract public_id from the URL

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Remove the image from the `images` array
      post.images.pull(imageId);
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully.",
        data: post,
      });
    }
    // If a new image is provided, it will be uploaded by CloudinaryStorage
    if (newImageFile) {
      // Cloudinary automatically uploads the image via the storage configuration
      const result = req.files.image[0]; // The file is automatically uploaded to Cloudinary

      // Replace the old image URL with the new one
      image.url = result.path; // The URL is stored as `path` by CloudinaryStorage
      image.caption = req.body.caption || image.caption; // Optional: Update caption if provided
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Image updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Error updating or deleting image:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};
