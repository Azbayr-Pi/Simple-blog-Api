const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        if (posts.length === 0) {
            res.status(404).json({
                message: "There is no post yet"
            })
        }
        res.status(200).json({
            status: "success",
            data: posts 
        })
    } catch (err) {
        res.status(500).json({
            status: "fail",
            error: err.message
        })
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            res.status(404).json({
                message: "Post not found"
            })
        }
        res.status(200).json({ status: "success", data: post });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            error: err.message,
        })
    }
}

const checkUserId = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user; 
}

const createPost = async(req, res) => {
    const { content, title, userId } = req.body;
    try {
        const user = await checkUserId(userId);
        if (user) {
            const post = await Post.create({
                content,
                title,
                userId
            });
            console.log(post);
            res.status(200).json({ status: "success", data: post });
        }
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}

const checkReqBody = (reqBody) => {
    if (reqBody.hasOwnProperty(title)) {
        return reqBody[title];
    } 
    if (reqBody.hasOwnProperty(content)) {
        return reqBody[content];
    } 
    if (reqBody.hasOwnProperty(content) && reqBody.hasOwnProperty(title)) {
        return reqBody;
    }
}

const checkUser = async (userId, postId) => {
    if (!userId) throw new Error("You are not logged in");
    console.log('ID: 📯 📯 📯 ', postId);                
    console.log('User ID: 📯 📯 📯 ', userId);
    if (typeof userId === 'string') {
        userId = Number(userId);
    }
    const post = await Post.findByPk(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.userId !== userId) {
        throw new Error('Unauthorized operation');
    }
    return post;
}

const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, content, userId } = req.body;
    try {
        const post = await checkUser(userId, postId);
        
        const updateData = {
            title: title !== undefined ? title : post.title,
            content: content !== undefined ? content: post.content
        }

        await post.update(updateData);

        res.status(200).json({
            status: "success", 
            message: "Post updated successfully",
            data: {
                post
            }
        });

    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        } else if (error.message === 'Unauthorized operation') {
            return res.status(403).json({ status: 'fail', message: error.message });
        } else if(error.message === 'You are not logged in') {
            return res.status(404).json({ status: 'fail', message: error.message });
        } else {
            return res.status(500).json({ status: 'fail', message: 'Error updating post' });
        }
    }
}

const deletePost = async (req, res) => {
    const id  = req.params.id;
    const { userId } = req.body; 
    try {
        const post = await checkUser(userId, id);
        post.destroy()
            .then(() => {
                console.log('Post deleted successfully');
            })
            .catch((err) => {
                console.log('Error deleting post:', err);
            })

        res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully',
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ status: 'fail', message: error.message });
        } else if (error.message === 'Unauthorized operation') {
            return res.status(403).json({ status: 'fail', message: error.message });
        } else if(error.message === 'You are not logged in') {
            return res.status(404).json({ status: 'fail', message: error.message });
        } else {
            return res.status(500).json({ status: 'fail', message: error.message });
        }
    }
} 

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}