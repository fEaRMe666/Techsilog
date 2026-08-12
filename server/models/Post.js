const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is Required"],
        ref: "User"
    },
    username: {
        type: String,
        required: [true, "Username is Required"]
    },
    comment: {
        type: String,
        required: [true, "Comment is Required"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: null
    }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is Required"]
    },
    content: {
        type: String,
        required: [true, "Content is Required"]
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Author ID is Required"],
        ref: "User"
    },
    authorUsername: {
        type: String,
        required: [true, "Author Username is Required"]
    },
    authorIsAdmin: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdOn: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema]
});

module.exports = mongoose.model("Post", postSchema);
