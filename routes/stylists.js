const express = require('express');
const {
    getStylists
} = require('../controllers/stylists')
const router = express.Router({
    mergeParams: true
});

// GET & POST route
router.route('/').get(getStylists);

module.exports = router;