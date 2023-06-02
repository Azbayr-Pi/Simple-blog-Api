const express = require('express');
const { getAllComments, getCommentById, 
    addComment, updateComment, deleteComment
    } = require('../controllers/commentController');
const commentRouter = express.Router({ mergeParams: true });

commentRouter.get('/comments', getAllComments);
commentRouter.get('/comments/:commentId', getCommentById);
commentRouter.post('/comments/addComment', addComment);
commentRouter.put('/comments/:commentId/editComment', updateComment);
commentRouter.delete('/comments/:commentId/deleteComment', deleteComment);

module.exports = commentRouter;