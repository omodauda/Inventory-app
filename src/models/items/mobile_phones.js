const mongoose = require('mongoose');
const schema = mongoose.Schema;

const mobilePhoneSchema = new schema({

    category: {
        type: String,
        // ref: "Category",
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
        type: String
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
        enum: ["New", "Used", "Refurbished"]
    },
    secondCondition: {
        type: String
    },
    ram: {
        type: String
    },
    rom: {
        type: String
    },
    screenSize: {
        type: String
    },
    colour: {
        type: String
    },
    os: {
        type: String
    },
    battery: {
        type: Number
    },
    price: {
        type: String
    },
    status: {
        type: String,
        default: "Reviewing",
        enum: ["Active", "Reviewing", "Closed", "Declined"]
    },
    promotion: {
        status: {
            type: Boolean
        },
        type:{
            type: String,
            enum: ["Top-week", "Top-month", "Boost-premium"]
        },
        startDate: {
            type: Date
        },
        dueDate:{
            type: Date
        }
    }

}, {timestamps: true});

const Mobile_Phone = mongoose.model("Mobile_Phone", mobilePhoneSchema);

module.exports = Mobile_Phone;