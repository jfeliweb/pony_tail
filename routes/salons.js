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

// Include other resouce routers
const stylistRouter = require('./stylists');

const router = express.Router();

// Re-route into other resource routers
router.use('/:salonId/stylists', stylistRouter);

// GET radius route
router.route('/radius/:zipcode/:distance').get(getSalonInRadius);

// PUT upload route
router.route('/:id/photo').put(salonPhotoUpload);

// GET & POST route
router.route('/').get(getSalons).post(createSalon);

// GET single, PUT & DELETE route
router.route('/:id').get(getSalon).put(updateSalon).delete(deleteSalon);


module.exports = router;