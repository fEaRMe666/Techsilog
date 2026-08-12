const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {

    try {

        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).send({
                message: "Email, username, and password are required"
            });
        }

        const existingEmail = await User.findOne({ email: email });

        if (existingEmail) {
            return res.status(409).send({
                message: "Email already exists"
            });
        }

        const existingUsername = await User.findOne({ username: username });

        if (existingUsername) {
            return res.status(409).send({
                message: "Username already exists"
            });
        }

        const newUser = new User({
            email: email,
            username: username,
            password: bcrypt.hashSync(password, 10)
        });

        await newUser.save();

        return res.status(201).send({
            message: "Registered Successfully"
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error in registration",
            error: error.message
        });
    }
};

module.exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send({
                message: "No user found"
            });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).send({
                message: "Email and password do not match"
            });
        }

        return res.status(200).send({
            access: auth.createAccessToken(user)
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error in login",
            error: error.message
        });
    }
};

module.exports.getUserDetails = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        return res.status(200).send(user);

    } catch (error) {

        return res.status(500).send({
            message: "Error getting user details",
            error: error.message
        });
    }
};

// Simple public profile with post and comment activity.
module.exports.getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.params.userId).select(
            "username isAdmin"
        );

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        const posts = await Post.find({
            authorId: user._id
        }).sort({ createdOn: -1 });

        const postsWithComments = await Post.find({
            "comments.userId": user._id
        });

        const commentActivity = [];

        postsWithComments.forEach(post => {

            post.comments.forEach(comment => {

                if (comment.userId.toString() === user._id.toString()) {
                    commentActivity.push({
                        postId: post._id,
                        postTitle: post.title,
                        commentId: comment._id,
                        comment: comment.comment,
                        createdOn: comment.createdOn,
                        updatedOn: comment.updatedOn
                    });
                }
            });
        });

        commentActivity.sort((a, b) => {
            return new Date(b.createdOn) - new Date(a.createdOn);
        });

        return res.status(200).send({
            user: user,
            posts: posts,
            comments: commentActivity
        });

    } catch (error) {

        return res.status(500).send({
            message: "Error getting user profile",
            error: error.message
        });
    }
};
