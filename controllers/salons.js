const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Salon = require('../models/Salon');

// @desc    Get all salons
// @route   GET /api/v1/salons
// @access  Public
exports.getSalons = asyncHandler(async (req, res, next) => {
        const salons = await Salon.find();

        res.status(200).json({
            success: true,
            count: salons.length,
            data: salons
        });
});

// @desc    Get single salons
// @route   GET /api/v1/salons/:id
// @access  Public
exports.getSalon = asyncHandler(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
        // The id format is correct but not in the database 
        return next(new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: salon
    });
});

// @desc    Create new salon
// @route   POST /api/v1/salons
// @access  Private
exports.createSalon = asyncHandler(async (req, res, next) => {
        const salon = await Salon.create(req.body);

        res.status(201).json({
            success: true,
            data: salon
        });
});

// @desc    Update salon
// @route   PUT /api/v1/salons/:id
// @access  Private
exports.updateSalon = asyncHandler(async (req, res, next) => {
        const salon = await Salon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!salon) {
            return next(new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: salon
        });
});

// @desc    Delete salon
// @route   DELETE /api/v1/salons/:id
// @access  Private
exports.deleteSalon = asyncHandler(async (req, res, next) => {
        const salon = await Salon.findByIdAndDelete(req.params.id);

        if (!salon) {
            return next(new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
});