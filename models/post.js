const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title:
        {
            type: String,
            default: null,
            trim: true,
            unique: true,
        },
        description:
        {
            type: String,
            default: null,
            trim: true,
        },
        image:
            [{ type: String }],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status:
        {
            type: Number,
            enum: [0, 1],
            default: 1
        },
    }, {
    timestamps: true
});


// create a model.
const Post = mongoose.model('Post', postSchema);
module.exports = Post;