const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tabletSchema = new schema({
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
    location:{
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true,
        enum: ["New", "Used", "Refurbished"]
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
    os:{
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Tablet = mongoose.model("Tablet", tabletSchema);

module.exports = Tablet;