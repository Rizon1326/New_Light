const Post = require('../models/Post');
const User = require('../models/User');
const minioClient = require('../config/minioConfig');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { createNotification } = require('./notificationController');

const getUserIdFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    return jwt.verify(token, process.env.JWT_SECRET).userId;
};
exports.createPost = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { title, codeSnippet } = req.body;

        if (!title || !codeSnippet ) {
            return res.status(400).json({ message: 'Title, code snippet, and a file are required' });
        }

        const bucketName = 'user-files';
        const fileName = `${uuidv4()}_${req.file.originalname}`;

        // Check if the bucket exists, if not create it
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket "${bucketName}" created successfully.`);
        }

        // Upload the file to MinIO
        await minioClient.putObject(bucketName, fileName, req.file.buffer);
        const fileUrl = `${bucketName}/${fileName}`;

        // Save the post in the database
        const post = new Post({ userId, title, codeSnippet, fileUrl });
        await post.save();

        // Notify all users except the post creator
        const users = await User.find({ _id: { $ne: userId } });
        for (const user of users) {
            await createNotification(user._id, 'New post available', post._id);
        }

        res.status(201).json({ post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
