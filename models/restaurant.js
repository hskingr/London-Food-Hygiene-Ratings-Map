const mongoose = require('mongoose')

const restaurantSchema = mongoose.Schema({
    FHRSID: {
        type: String,
        trim: true
    },
    LocalAuthorityBusinessID: {
        type: String,
        trim: false
    },
    BusinessName: {
        type: String,
        trim: true
    },
    BusinessType: {
        type: String,
        trim: true
    },
    BusinessTypeID: {
        type: String,
        trim: true
    },
    AddressLine1: {
        type: String,
        trim: true
    },
    AddressLine2: {
        type: String,
        trim: true
    },
    AddressLine3: {
        type: String,
        trim: true
    },
    AddressLine4: {
        type: String,
        trim: true
    },
    PostCode: {
        type: String,
        trim: true
    },
    RatingValue: {
        type: String,
        trim: true
    },
    RatingKey: {
        type: String,
        trim: true
    },
    RatingDate: {
        type: String,
        trim: true
    },
    LocalAuthorityCode: {
        type: String,
        trim: true
    },
    LocalAuthorityName: {
        type: String,
        trim: true
    },
    LocalAuthorityWebSite: {
        type: String,
        trim: true
    },
    LocalAuthorityEmailAddress: {
        type: String,
        trim: true
    },
    Scores: [{
        Hygiene: {
            type: String,
            trim: true
        },
        Structural: {
            type: String,
            trim: true
        },
        ConfidenceInManagement: {
            type: String,
            trim: true
        }
    }],
    SchemeType: {
        type: String,
        trim: true
    },
    Geocode: [{
        Longitude: {
            type: String,
            trim: true
        },
        Latitude: {
            type: String,
            trim: true
        },
    }],
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)
Restaurant.createIndexes()

module.exports = Restaurant