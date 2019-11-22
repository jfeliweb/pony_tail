const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Stylist = require('../models/Stylist');

// @desc    Get all stylists
// @route   GET /api/v1/stylists
// @route   GET /api/v1/salons/:salonId/stylists
// @access  Public
exports.getStylists = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.salonId) {
        query = Stylist.find({
            salon: req.params.salonId
        });
    } else {
        query = Stylist.find();
    }

    const stylists = await query;

    res.status(200).json({
        success: true,
        count: stylists.length,
        data: stylists
    });
})