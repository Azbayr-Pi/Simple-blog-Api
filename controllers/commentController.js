const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const { checkUserId } = require('./postController');


// helper method for checking the postId passed in
const getPostById = async (postId) => {
    const post = await Post.findByPk(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
}

const getAllComments = async (req, res) => {
    try {
        const post = await getPostById(req.params.postId);
        const comments = await post.getComments({ attributes: { exclude: ['UserId'] } });
        if (comments.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No comments found for this post",
                data: {
                    post
                }
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                comments
            }
        });

    } catch (error) {
        if (error.message === "Post not found") {
            res.status(404).json({
                status: "fail",
                message: error.message
            })
        } else {
            res.status(500).json({
                status: "fail",
                message: error.message
            })
        }
    }
}

// helper method for checking the commentId passed in
const checkCommentId = async (commentId) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }
    return comment;
}

const getCommentById = async (req, res) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId; 
    try {
        const post = await getPostById(postId);
        const comment = await checkCommentId(commentId);
        const user  = await checkUserId(comment.UserId);
        res.status(200).json({
            status: "success",
            data: { 
                comment,
                user
            }
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
};

const addComment = async (req, res) => {
    const { userId, content } = req.body;
    if (!content || !userId) {
        return res.status(401).json({
            status: "fail",
            message: "Both userId and content fields have to be included!"
        })
    }
    const postId = req.params.postId;
    try {
        const user = await checkUserId(userId);
        const post = await getPostById(postId);
        const comment = await Comment.create({
            content,
            UserId: userId
        });
        await post.addComment(comment);
        res.status(201).json({
            status: "success",
            message: "Successfully added a comment",
            data: { 
                post,
                comment
            } 
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}

// helper method for checking if the commentId passed in matches the commentId in the Post instance
const verifyCommentBelongsToPost = async (commentId, post) => {
    const comment = await Comment.findOne({
        where: {
            PostId: post.id,
            id: commentId
        }
    });
    if (!comment) {
        throw new Error('There is no comment with that id in this post');
    } else {
        return comment;
    }
}

const updateComment = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { userId, content } = req.body;
    try {
        const post = await getPostById(postId);
        const comment = await verifyCommentBelongsToPost(commentId, post);
        if (comment.UserId === userId) {
            const updateData = {
                content: content !== undefined ? content : comment.content,
            }
            await comment.update(updateData);
            res.status(201).json({
                status: "success",
                message: "Comment updated successfully",
                comment: comment
            });
        } else {
            res.status(401).json({
                status: "fail",
                message: "Unauthorized to update the comment"
            })
        }
    } catch (error) {
        if (error.message === "There is no comment with that id in this post") {
            res.status(404).json({
                status: "fail",
                message: error.message
            });
        } else if (error.message === "Post not found") {
            res.status(404).json({
                status: "fail",
                message: error.message
            });
        } else {
            res.status(500).json({
                status: "fail",
                message: error.message
            });   
        }
    }
}

const deleteComment = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { userId } = req.body;
    try {
        const post = await getPostById(postId);
        const comment = await verifyCommentBelongsToPost(commentId, post);
        if (comment.UserId === userId) {
            comment.destroy()
                .then(() => {
                    console.log(`Comment with id of ${comment.id} deleted`);
                }).catch((err) => {
                    console.log("Error deleting comment", err);
                })
            res.status(200).json({
                status: "success",
                message: "Comment deleted"
            })
        } else {
            res.status(401).json({
                status: "fail",
                message: "Unauthorized to delete"
            });
        }
    } catch (error) {
        if (error.message === "There is no comment with that id in this post") {
            res.status(404).json({
                status: "fail",
                message: error.message
            });
        } else if (error.message === "Post not found") {
            res.status(404).json({
                status: "fail",
                message: error.message
            });
        } else {
            res.status(500).json({
                status: "fail",
                message: error.message
            });   
        }
    }
}

module.exports = {
    getAllComments,
    getCommentById,
    addComment,
    updateComment,
    deleteComment
}
