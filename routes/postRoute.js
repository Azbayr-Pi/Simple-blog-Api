const express = require('express');
const postRouter = express.Router();

const { getAllPosts, getPostById, 
    createPost, updatePost, deletePost } =  require('../controllers/postController');

postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/create', createPost);
postRouter.put('/:id/edit', updatePost);
postRouter.delete('/:id/delete', deletePost);

module.exports = postRouter;