const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocode');
const Salon = require('../models/Salon');

// @desc    Get all salons
// @route   GET /api/v1/salons
// @access  Public
exports.getSalons = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc    Get single salons
// @route   GET /api/v1/salons/:id
// @access  Public
exports.getSalon = asyncHandler(async (req, res, next) => {
	const salon = await Salon.findById(req.params.id);

	if (!salon) {
		// The id format is correct but not in the database
		return next(
			new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: salon,
	});
});

// @desc    Create new salon
// @route   POST /api/v1/salons
// @access  Private
exports.createSalon = asyncHandler(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id;

	// Check for Published Salon
	const publishedSalon = await Salon.findOne({ user: req.user.id });

	// If the user is not an admin, they can only add one Salon
	if (publishedSalon && req.user.role != 'admin') {
		return next(
			new ErrorResponse(
				`The user with ID ${req.user.id} has already published a salon`,
				400
			)
		);
	}

	const salon = await Salon.create(req.body);

	res.status(201).json({
		success: true,
		data: salon,
	});
});

// @desc    Update salon
// @route   PUT /api/v1/salons/:id
// @access  Private
exports.updateSalon = asyncHandler(async (req, res, next) => {
	let salon = await Salon.findById(req.params.id);

	if (!salon) {
		return next(
			new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404)
		);
	}

	// User is Salon owner
	if (salon.user.toString() != req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.params.id} is not authorized to update this salon`,
				401
			)
		);
	}

	salon = await Salon.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: salon,
	});
});

// @desc    Delete salon
// @route   DELETE /api/v1/salons/:id
// @access  Private
exports.deleteSalon = asyncHandler(async (req, res, next) => {
	const salon = await Salon.findById(req.params.id);

	if (!salon) {
		return next(
			new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404)
		);
	}

	// User is Salon owner
	if (salon.user.toString() != req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.params.id} is not authorized to delete this salon`,
				401
			)
		);
	}

	salon.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});

// @desc    Get salons within a radius
// @route   GET /api/v1/salons/radius/:zipcode/:distance
// @access  Private
exports.getSalonInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get latitude and longitude from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	const salons = await Salon.find({
		location: {
			$geoWithin: {
				$centerSphere: [[lng, lat], radius],
			},
		},
	});

	res.status(200).json({
		success: true,
		count: salons.length,
		data: salons,
	});
});

// @desc    Upload photo for salon salon
// @route   PUT /api/v1/salons/:id/photo
// @access  Private
exports.salonPhotoUpload = asyncHandler(async (req, res, next) => {
	const salon = await Salon.findById(req.params.id);

	if (!salon) {
		return next(
			new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404)
		);
	}

	// User is Salon owner
	if (salon.user.toString() != req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				`User ${req.params.id} is not authorized to upload images on this salon`,
				401
			)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure it is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an image file!`, 400));
	}

	// Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	// Create custom filename
	file.name = `photo_${salon.id}${path.parse(file.name).ext}`;

	// Upload file
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file uploading...`, 500));
		}

		await Salon.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});
