const ErrorResponse = require('../utils/errorResponse');
const Salon = require('../models/Salon');

// @desc    Get all salons
// @route   GET /api/v1/salons
// @access  Public
exports.getSalons = async (req, res, next) => {
    try {  
        const salons = await Salon.find();

        res.status(200).json({
            success: true,
            count: salons.length,
            data: salons
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err
        });
    }
    
};

// @desc    Get single salons
// @route   GET /api/v1/salons/:id
// @access  Public
exports.getSalon = async (req, res, next) => {
    try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
        // The id format is correct but not in the database 
        return next(new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: salon
    })
    } catch (err) {
        // The id format is not correct
        next(new ErrorResponse(`Salon not found with id of ${req.params.id}`, 404));
    }
};

// @desc    Create new salon
// @route   POST /api/v1/salons
// @access  Private
exports.createSalon = async (req, res, next) => {
    try {
        const salon = await Salon.create(req.body);

        res.status(201).json({
            success: true,
            data: salon
        });
    } catch (err) {
        res.status(400).json({
            success: false, 
            msg: err
        });
    }
    
};

// @desc    Update salon
// @route   PUT /api/v1/salons/:id
// @access  Private
exports.updateSalon = async (req, res, next) => {
    try {
        const salon = await Salon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!salon) {
            return res.status(400).json({
                success: false,
                msg: `Salon Not Found`
            });
        }

        res.status(200).json({
            success: true,
            data: salon
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err
        });
    }
    
};

// @desc    Delete salon
// @route   DELETE /api/v1/salons/:id
// @access  Private
exports.deleteSalon = async (req, res, next) => {
    try {
        const salon = await Salon.findByIdAndDelete(req.params.id);

        if (!salon) {
            return res.status(400).json({
                success: false,
                msg: `Salon Not Found`
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            msg: err
        });
    }
};