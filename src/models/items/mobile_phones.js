const mongoose = require('mongoose');
const schema = mongoose.Schema;

const mobilePhoneSchema = new schema({

    category: {
        type: String,
        required: true
    },
    owner: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    itemImages: {
        images: [{
            type: String
        }],
        cloudinary_ids: [{
            type: String
        }]
    },
    location: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
        enum: ["New", "Used", "Refurbished"]
    },
    secondCondition: {
        type: String
    },
    ram: {
        type: String,
        required: true
    },
    rom: {
        type: String,
        required: true
    },
    screenSize: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    battery: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Mobile_Phone = mongoose.model("Mobile_Phone", mobilePhoneSchema);

module.exports = Mobile_Phone;