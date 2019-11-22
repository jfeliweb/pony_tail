const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
var geocoder = require('../utils/geocode');
const Salon = require('../models/Salon');


// @desc    Get all salons
// @route   GET /api/v1/salons
// @access  Public
exports.getSalons = asyncHandler(async (req, res, next) => {
    // Init query in it's own varible
    let query;
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to be exclude so they don't get match
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create a query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, $lte, $lt, $in) Replace query string and match it
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // Find resource
    query = Salon.find(JSON.parse(queryStr));

    // SELECT Fields
    if (req.query.select) {
        // Change the comama ',' to a space ' '
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // SORT Fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query =query.sort('-createdAt');
    }

    // PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Salon.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const salons = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        success: true,
        count: salons.length,
        pagination,
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

// @desc    Get salons within a radius
// @route   GET /api/v1/salons/radius/:zipcode/:distance
// @access  Private
exports.getSalonInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get latitude and longitude from geocoder
    const loc =  await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const salons = await Salon.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });
    
    res.status(200).json({
        success: true,
        count: salons.length,
        data: salons
    })
});