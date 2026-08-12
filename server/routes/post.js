const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");
const auth = require("../auth");

// Public routes
router.get("/getAllPosts", postController.getAllPosts);
router.get("/getPost/:postId", postController.getPost);

// Authenticated routes
router.post("/addPost", auth.verify, postController.addPost);
router.patch("/updatePost/:postId", auth.verify, postController.updatePost);
router.delete("/deletePost/:postId", auth.verify, postController.deletePost);
router.post("/addComment/:postId", auth.verify, postController.addComment);

// Upgrade routes
router.patch("/archivePost/:postId", auth.verify, postController.archivePost);
router.patch("/votePost/:postId", auth.verify, postController.votePost);
router.patch(
    "/updateComment/:postId/:commentId",
    auth.verify,
    postController.updateComment
);
router.delete(
    "/deleteComment/:postId/:commentId",
    auth.verify,
    postController.deleteComment
);

router.patch(
    "/voteComment/:postId/:commentId",
    auth.verify,
    postController.voteComment
);

module.exports = router;
