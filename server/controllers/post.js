const Post = require("../models/Post");
const User = require("../models/User");

module.exports.addPost = async (req, res) => {

    try {

        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).send({
                message: "Title and content are required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        const newPost = new Post({
            title: title,
            content: content,
            authorId: user._id,
            authorUsername: user.username,
            authorIsAdmin: user.isAdmin,
            tags: Array.isArray(tags) ? tags : []
        });

        const savedPost = await newPost.save();

        return res.status(201).send({
            message: "Post created successfully",
            post: savedPost
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error creating post",
            error: error.message
        });
    }
};

module.exports.getAllPosts = async (req, res) => {

    try {

        const posts = await Post.find({
            isArchived: { $ne: true }
        }).sort({ createdOn: -1 });

        return res.status(200).send(posts);

    } catch (error) {

        return res.status(500).send({
            message: "Error getting posts",
            error: error.message
        });
    }
};

module.exports.getPost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        post.views = (post.views || 0) + 1;
        await post.save();

        return res.status(200).send(post);

    } catch (error) {

        return res.status(500).send({
            message: "Error getting post",
            error: error.message
        });
    }
};

module.exports.updatePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        // Only the creator of the post can update it.
        // Admin status does not override this rule.
        if (post.authorId.toString() !== req.user.id) {
            return res.status(403).send({
                message: "You can only update your own post"
            });
        }

        if (req.body.title !== undefined) {
            post.title = req.body.title;
        }

        if (req.body.content !== undefined) {
            post.content = req.body.content;
        }

        if (Array.isArray(req.body.tags)) {
            post.tags = req.body.tags;
        }

        const updatedPost = await post.save();

        return res.status(200).send({
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error updating post",
            error: error.message
        });
    }
};

module.exports.deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        const isOwner = post.authorId.toString() === req.user.id;
        const isAdmin = req.user.isAdmin;

        // Regular users can only delete their own posts.
        // Admins can delete any post.
        if (!isOwner && !isAdmin) {
            return res.status(403).send({
                message: "You can only delete your own post"
            });
        }

        await Post.findByIdAndDelete(req.params.postId);

        return res.status(200).send({
            message: "Post deleted successfully"
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error deleting post",
            error: error.message
        });
    }
};

module.exports.addComment = async (req, res) => {

    try {

        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({
                message: "Comment is required"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        post.comments.push({
            userId: user._id,
            username: user.username,
            comment: comment,
            isAdmin: user.isAdmin
        });

        const updatedPost = await post.save();

        return res.status(201).send({
            message: "Comment added successfully",
            post: updatedPost
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error adding comment",
            error: error.message
        });
    }
};

// Archive or restore your own post.
module.exports.archivePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        if (post.authorId.toString() !== req.user.id) {
            return res.status(403).send({
                message: "You can only archive your own post"
            });
        }

        post.isArchived = !post.isArchived;

        const updatedPost = await post.save();

        return res.status(200).send({
            message: post.isArchived
                ? "Post archived successfully"
                : "Post restored successfully",
            post: updatedPost
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error archiving post",
            error: error.message
        });
    }
};

// Post upvote and downvote.
module.exports.votePost = async (req, res) => {

    try {

        const { vote } = req.body;

        if (vote !== "up" && vote !== "down") {
            return res.status(400).send({
                message: "Vote must be up or down"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        const upvoteIndex = post.upvotes.findIndex(
            userId => userId.toString() === req.user.id
        );

        const downvoteIndex = post.downvotes.findIndex(
            userId => userId.toString() === req.user.id
        );

        if (vote === "up") {

            if (upvoteIndex > -1) {
                post.upvotes.splice(upvoteIndex, 1);
            } else {

                if (downvoteIndex > -1) {
                    post.downvotes.splice(downvoteIndex, 1);
                }

                post.upvotes.push(req.user.id);
            }
        }

        if (vote === "down") {

            if (downvoteIndex > -1) {
                post.downvotes.splice(downvoteIndex, 1);
            } else {

                if (upvoteIndex > -1) {
                    post.upvotes.splice(upvoteIndex, 1);
                }

                post.downvotes.push(req.user.id);
            }
        }

        await post.save();

        return res.status(200).send({
            message: "Vote updated successfully",
            upvotes: post.upvotes,
            downvotes: post.downvotes
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error voting on post",
            error: error.message
        });
    }
};

// Users can edit only their own comments.
module.exports.updateComment = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        const selectedComment = post.comments.id(req.params.commentId);

        if (!selectedComment) {
            return res.status(404).send({
                message: "Comment not found"
            });
        }

        if (selectedComment.userId.toString() !== req.user.id) {
            return res.status(403).send({
                message: "You can only update your own comment"
            });
        }

        if (!req.body.comment) {
            return res.status(400).send({
                message: "Comment is required"
            });
        }

        selectedComment.comment = req.body.comment;
        selectedComment.updatedOn = new Date();

        const updatedPost = await post.save();

        return res.status(200).send({
            message: "Comment updated successfully",
            post: updatedPost
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error updating comment",
            error: error.message
        });
    }
};

// Admin can delete any comment.
module.exports.deleteComment = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        const selectedComment = post.comments.id(req.params.commentId);

        if (!selectedComment) {
            return res.status(404).send({
                message: "Comment not found"
            });
        }

        const isOwner = selectedComment.userId.toString() === req.user.id;
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            return res.status(403).send({
                message: "You can only delete your own comment"
            });
        }

        post.comments.pull(req.params.commentId);

        const updatedPost = await post.save();

        return res.status(200).send({
            message: "Comment deleted successfully",
            post: updatedPost
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error deleting comment",
            error: error.message
        });
    }
};

//comment upvote and downvote.
module.exports.voteComment = async (req, res) => {

    try {

        const { vote } = req.body;

        if (vote !== "up" && vote !== "down") {
            return res.status(400).send({
                message: "Vote must be up or down"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        const selectedComment = post.comments.id(req.params.commentId);

        if (!selectedComment) {
            return res.status(404).send({
                message: "Comment not found"
            });
        }

        const upvoteIndex = selectedComment.upvotes.findIndex(
            userId => userId.toString() === req.user.id
        );

        const downvoteIndex = selectedComment.downvotes.findIndex(
            userId => userId.toString() === req.user.id
        );

        if (vote === "up") {

            if (upvoteIndex > -1) {
                selectedComment.upvotes.splice(upvoteIndex, 1);
            } else {

                if (downvoteIndex > -1) {
                    selectedComment.downvotes.splice(downvoteIndex, 1);
                }

                selectedComment.upvotes.push(req.user.id);
            }
        }

        if (vote === "down") {

            if (downvoteIndex > -1) {
                selectedComment.downvotes.splice(downvoteIndex, 1);
            } else {

                if (upvoteIndex > -1) {
                    selectedComment.upvotes.splice(upvoteIndex, 1);
                }

                selectedComment.downvotes.push(req.user.id);
            }
        }

        await post.save();

        return res.status(200).send({
            message: "Comment vote updated successfully",
            upvotes: selectedComment.upvotes,
            downvotes: selectedComment.downvotes
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error voting on comment",
            error: error.message
        });
    }
};
