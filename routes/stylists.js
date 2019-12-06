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

// Protect the routes from unauthorize users
const {
    protect
} = require('../middleware/auth');

// GET & POST route
router
.route('/')
.get(advancedResults(Stylist, {
    path: 'salon',
    select: 'name description'
}), getStylists)
.post(protect, addStylist);

router
.route('/:id')
.get(getStylist)
.put(protect, updateStylist)
.delete(protect, deleteStylist);


module.exports = router;