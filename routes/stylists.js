const express = require('express');
const {
    getStylists,
    getStylist,
    addStylist,
    updateStylist,
    deleteStylist
} = require('../controllers/stylists')

const router = express.Router({
    mergeParams: true
});

// GET & POST route
router.route('/').get(getStylists).post(addStylist);
router.route('/:id').get(getStylist).put(updateStylist).delete(deleteStylist);



module.exports = router;