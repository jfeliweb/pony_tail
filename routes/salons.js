const express = require('express');
const {
    getSalons,
    getSalon,
    updateSalon,
    createSalon,
    deleteSalon
} = require('../controllers/salons')
const router = express.Router();

// GET & POST route
router.route('/').get(getSalons).post(createSalon)

// GET single, PUT & DELETE route
router.route('/:id').get(getSalon).put(updateSalon).delete(deleteSalon);


module.exports = router;