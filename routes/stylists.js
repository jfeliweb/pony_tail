const express = require('express');
const {
    getStylists,
    getStylist,
    addStylist,
    updateStylist,
    deleteStylist
} = require('../controllers/stylists');

const Stylist = require('../models/Stylist');

const router = express.Router({
    mergeParams: true
});

const advancedResults = require("../middleware/advancedResults");
// Protect the routes from unauthorize users
const {
    protect,
    authorize
} = require('../middleware/auth');

// GET & POST route
router
.route('/')
.get(advancedResults(Stylist, {
    path: 'salon',
    select: 'name description'
}), getStylists)
.post(protect, authorize('owner', 'stylist', 'admin'), addStylist);

router
.route('/:id')
.get(getStylist)
.put(protect, authorize('owner', 'stylist', 'admin'), updateStylist)
.delete(protect, authorize('owner', 'stylist', 'admin'), deleteStylist);


module.exports = router;