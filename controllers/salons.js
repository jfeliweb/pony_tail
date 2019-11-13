// @desc    Get all salons
// @route   GET /api/v1/salons
// @access  Public
exports.getSalons = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all salons'
    });
}

// @desc    Get single salons
// @route   GET /api/v1/salons/:id
// @access  Public
exports.getSalon = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Get salon ${req.params.id}`
    });
}

// @desc    Create new salon
// @route   POST /api/v1/salons
// @access  Private
exports.createSalon = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create new salon'
    });
}

// @desc    Update salon
// @route   PUT /api/v1/salons/:id
// @access  Private
exports.updateSalon = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update salon ${req.params.id}`
    });
}

// @desc    Delete salon
// @route   DELETE /api/v1/salons/:id
// @access  Private
exports.deleteSalon = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete salon ${req.params.id}`
    });
}