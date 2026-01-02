const express = require('express');
const { getResources, createResource } = require('../controllers/resourceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getResources).post(protect, restrictTo('admin'), createResource);

module.exports = router;
