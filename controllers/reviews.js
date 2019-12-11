const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Salon = require('../models/Salon');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/salons/:salonId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.salonId) {
		const reviews = await Review.find({ salon: req.params.salonId });

		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: 'salon',
		select: 'name description',
	});

	if (!review) {
		return next(
			new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc    Create Review
// @route   POST /api/v1/salons/:salonId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.salon = req.params.salonId;
	req.body.user = req.user.id;

	const salon = await Salon.findById(req.params.salonId);

	if (!salon) {
		return next(
			new ErrorResponse(
				`No salon found with the id of ${req.params.salonId}`,
				404
			)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		data: review,
	});
});

// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
		);
	}

	if (review.user.toString() != req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`Not allowed to update review`, 401));
	}

	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
		);
	}

	if (review.user.toString() != req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`Not allowed to update review`, 401));
	}

	await review.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
