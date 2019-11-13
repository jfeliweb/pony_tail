const express = require('express');
const router = express.Router();

// GET route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Show all salons'
    });
});

router.get('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Get salon ${req.params.id}`
    });
});

// POST route
router.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        msg: 'Create new salon'
    });
});

// UPDATE route
router.put('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Update salon ${req.params.id}`
    });
});

// DELETE route
router.delete('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `Delete salon ${req.params.id}`
    });
});

module.exports = router;