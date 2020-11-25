const mongoose = require('mongoose');
const schema = mongoose.Schema;

const laptopAndComputerSchema = new schema({
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
    type: {
        type: String,
        required: true,
        enum: ["Laptop", "Desktop Computer"]
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true
    },
    condition:{
        type: String,
        required: true,
        enum: ["New", "Used", "Refurbished"]
    },
    price: {
        type: String,
        required: true
    },
    processor: {
        type: String,
        required: true
    },
    numberOfCores: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    storageCapacity: {
        type: String,
        required: true
    },
    storageType: {
        type: String,
        required: true
    },
    displaySize: {
        type: String,
        required: true
    },
    graphicCard: {
        type: String,
        required: true
    },
    graphicCardMemory: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},{timestamps: true});

const LaptopAndComputer = mongoose.model('LaptopAndComputer', laptopAndComputerSchema);

module.exports = LaptopAndComputer;