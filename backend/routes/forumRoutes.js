const express = require('express');
const { createPost, getPosts } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getPosts).post(protect, createPost);

module.exports = router;
