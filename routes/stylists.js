const express = require('express');
const {
    getStylists,
    getStylist,
    addStylist,
    updateStylist,
    deleteStylist
} = require('../controllers/stylists');

const Stylist = require('../models/Stylist');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({
    mergeParams: true
});

// GET & POST route
router.route('/').get(advancedResults(Stylist, {
    path: 'salon',
    select: 'name description'
}), getStylists).post(addStylist);
router.route('/:id').get(getStylist).put(updateStylist).delete(deleteStylist);



module.exports = router;