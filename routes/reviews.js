const express = require('express');
const {
	getReviews,
	getReview,
	addReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({
	mergeParams: true,
});

const advancedResults = require('../middleware/advancedResults');
// Protect the routes from unauthorize users
const { protect, authorize } = require('../middleware/auth');

// GET & POST route
router
	.route('/')
	.get(
		advancedResults(Review, {
			path: 'salon',
			select: 'name description',
		}),
		getReviews
	)
	.post(protect, authorize('user', 'admin'), addReview);

router
	.route('/:id')
	.get(getReview)
	.put(protect, authorize('user', 'admin'), updateReview)
	.delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
