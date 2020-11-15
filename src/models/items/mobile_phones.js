const mongoose = require('mongoose');
const schema = mongoose.Schema;

const mobilePhoneSchema = new schema({

    category: {
        type: schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    owner: {
        type: schema.Types.ObjectId,
        ref: "User",
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
        enum: ["Active", "Reviewing", "Closed", "Declined"]
    },
    promoted: {
        type: Boolean,
        required: true
    }

}, {timestamps: true});

const Mobile_Phone = mongoose.model("Mobile_Phone", mobilePhoneSchema);

module.exports = Mobile_Phone;