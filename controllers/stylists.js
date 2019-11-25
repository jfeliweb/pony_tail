const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Stylist = require('../models/Stylist');
const Salon = require('../models/Salon');

// @desc    Get all stylists
// @route   GET /api/v1/stylists
// @route   GET /api/v1/salons/:salonId/stylists
// @access  Public
exports.getStylists = asyncHandler(async (req, res, next) => {
    if (req.params.salonId) {
        const stylists = await Stylist.find({ salon: req.params.salonId });

        return res.status(200).json({
            success: true,
            count: stylists.length,
            data: stylists
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get a single stylist
// @route   GET /api/v1/stylists/:id
// @access  Public
exports.getStylist = asyncHandler(async (req, res, next) => {
    const stylist = await Stylist.findById(req.params.id).populate({
        path: 'salon',
        select: 'name description'
    });

    if (!stylist) {
        return next(new ErrorResponse(`No stylist found with the id of ${req.params.id}`, 404));
    }
    

    res.status(200).json({
        success: true,
        data: stylist
    });
});

// @desc    Add a stylist
// @route   POST /api/v1/salons/:salonId/stylists
// @access  Private
exports.addStylist = asyncHandler(async (req, res, next) => {
    req.body.salon = req.params.salonId;

    const salon = await Salon.findById(req.params.salonId);

    if (!salon) {
        return next(new ErrorResponse(`No salon found with the id of ${req.params.salonId}`, 404));
    }

    const stylist = await Stylist.create(req.body);


    res.status(200).json({
        success: true,
        data: stylist
    });
});

// @desc    Update stylist
// @route   PUT /api/v1/stylists/:id
// @access  Private
exports.updateStylist = asyncHandler(async (req, res, next) => {
    let stylist = await Stylist.findById(req.params.id);

    if (!stylist) {
        return next(new ErrorResponse(`No stylist found with the id of ${req.params.id}`, 404));
    }

    stylist = await Stylist.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });


    res.status(200).json({
        success: true,
        data: stylist
    });
});

// @desc    Delete stylist
// @route   DELETE /api/v1/stylists/:id
// @access  Private
exports.deleteStylist = asyncHandler(async (req, res, next) => {
    const stylist = await Stylist.findById(req.params.id);

    if (!stylist) {
        return next(new ErrorResponse(`No stylist found with the id of ${req.params.id}`, 404));
    }

    await stylist.remove();


    res.status(200).json({
        success: true,
        data: {}
    });
});