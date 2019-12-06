const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocode');

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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

// Create Salon slug from the Name
SalonSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});

// Geocode & create location field
SalonSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

    // Do not save address in Database
    this.address = undefined;
    next();
});

// Cascade delete stylists when a salon is deleted
SalonSchema.pre('remove', async function (next) {
    console.log(`Stylists are going bye bye from salon ${this._id}`);
    await this.model('Stylist').deleteMany({
        salon: this._id
    });
    next();
});

// Reserves populate with Virtuals
SalonSchema.virtual('stylists', {
    ref: 'Stylist',
    localField: '_id',
    foreignField: 'salon',
    justOne: false
});

module.exports = mongoose.model('Salon', SalonSchema);