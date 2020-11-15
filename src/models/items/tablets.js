const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tabletSchema = new schema({
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
        required: true
    },
    model: {
        type: String,
    },
    condition: {
        type: String,
        enum: ["New", "Used", "Refurbished"]
    },
    storageCapacity: {
        type: String
    },
    screenSize: {
        type: String
    },
    colour: {
        type: String
    },
    OperatingSystem:{
        type: String
    },
    ram: {
        type: String
    },
    description: {
        type: String
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

const Tablet = mongoose.model("Tablet", tabletSchema);

module.exports = Tablet;