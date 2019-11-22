const mongoose = require('mongoose');
//const slugify = require('slugify');

const StylistSchema = new mongoose.Schema({
    stylistName: {
        type: String,
        trim: true,
        required: [true, 'Please add stylist name']
    },
    //slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    experinceLevel: {
        type: String,
        required: [true, 'Please add Experince Level']
    },
    specialization: {
        type: [String],
            required: true,
            enum: [
                'Blowouts',
                'Perms',
                'Natural Hair',
                'Coloring',
                'Hair Extension',
                'Bobs',
                'Hair Braids',
                'Mens Hair',
                'Haircuts',
                'Kids Hair',
                'Manicure & Pedicure',
                'Makeup',
                'Pony Tails'
            ]
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Please add a hourly rate']
    },
    walkIn: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    salon: {
        type: mongoose.Schema.ObjectId,
        ref: 'Salon',
        required: true
    }
});

module.exports = mongoose.model('Stylist', StylistSchema);