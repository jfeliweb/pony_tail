const express = require('express');
const {
    getSalons,
    getSalon,
    updateSalon,
    createSalon,
    deleteSalon,
    getSalonInRadius
} = require('../controllers/salons')
const router = express.Router();

// GET radius route
router.route('/radius/:zipcode/:distance').get(getSalonInRadius);

// GET & POST route
router.route('/').get(getSalons).post(createSalon);

// GET single, PUT & DELETE route
router.route('/:id').get(getSalon).put(updateSalon).delete(deleteSalon);


module.exports = router;