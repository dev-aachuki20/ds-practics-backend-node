const fs = require('fs');
const path = require('path');
const Post = require('../../models/post');
const { postSchema, postUpdateSchema } = require('../../validations/postValidation');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { error } = postSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });

        }
        const { title, description, status } = req.body;
        const authorId = req.user._id
        const imagePaths = req.files.map((file) => file.path.replace(/\\/g, '/'));

        const post = new Post({
            title,
            description,
            image: imagePaths || [],
            author: authorId,
            status,
        });

        const savedPost = await post.save();
        res.status(201).json({ message: 'Post created successfully', data: savedPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No post found.' });
        }

        return res.status(200).json({ message: 'Posts fetched successfully', data: posts });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post fetched successfully', data: post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
    try {
        const { error } = postUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                errors: error.details.map(detail => detail.message)
            });
        }

        const { id } = req.params;
        const { title, description, status } = req.body;

        const authorId = req.user._id;
        const imagePaths = req.files ? req.files.map((file) => file.path.replace(/\\/g, '/')) : [];

        const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (imagePaths.length > 0) {
            existingPost.image.forEach((oldImagePath) => {
                const fullPath = path.join(__dirname, '../../', oldImagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, description, image: imagePaths, author: authorId, status },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully', data: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
