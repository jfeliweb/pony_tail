const express = require('express');
const {
    getSalons,
    getSalon,
    updateSalon,
    createSalon,
    deleteSalon,
    getSalonInRadius,
    salonPhotoUpload
} = require('../controllers/salons');

const Salon = require('../models/Salon');
const advancedResults = require('../middleware/advancedResults');

// Include other resouce routers
const stylistRouter = require('./stylists');

const router = express.Router();

// Protect the routes from unauthorize users
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:salonId/stylists', stylistRouter);

// GET radius route
router.route('/radius/:zipcode/:distance').get(getSalonInRadius);

// PUT upload route
router.route('/:id/photo').put(protect, authorize('owner', 'admin'), salonPhotoUpload);

// GET & POST route
router.route('/').get(advancedResults(Salon, 'stylists'), getSalons).post(protect, authorize('owner', 'admin'), createSalon);

// GET single, PUT & DELETE route
router.route('/:id').get(getSalon).put(protect, authorize('owner', 'admin'), updateSalon).delete(protect, authorize('owner', 'admin'), deleteSalon);


module.exports = router;