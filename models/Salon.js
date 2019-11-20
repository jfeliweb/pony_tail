const mongoose = require('mongoose');
const slugify = require('slugify');

const SalonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [60, 'Name can not be more than 60 characters']
    },
    slug: String,
    description: {
       type: String,
           required: [true, 'Please add a description'],
           maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please use a valid URL with HTTP or HTTPS']
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/, 'Please add a valid email']
    },
    address: {
        type: String,
         required: [true, 'Please add salon address']
    },
    location: {
        type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String
    },
    services: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'Blowout',
            'Perm',
            'Natural Hair',
            'Hair Coloring',
            'Hair Extension',
            'Hair Treatment',
            'Mens Haircut',
            'Womens Haircut',
            'Kids Haircut',
            'Manicure & Pedicure',
            'Makeup',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    hairType: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            'African-American',
            'Asian',
            'Curly',
            'Straight'
        ]
    },
    acceptsCreditCard: {
        type: Boolean,
        default: false
    },
    acceptsApplePay: {
        type: Boolean,
        default: false
    },
    byAppointmentOnly: {
        type: Boolean,
        default: false
    },
    freeWifi: {
        type: Boolean,
        default: false
    },
    militaryDiscount: {
        type: Boolean,
        default: false
    },
    kidFriendly: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Salon slug from the Name
SalonSchema.pre('save', function () { 
    this.slug = slugify(this.name, { lower: true });
    next();
 });

module.exports = mongoose.model('Salon', SalonSchema);