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
        type: String
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
        enum: ["New", "Used", "Refurbished"]
    },
    price: {
        type: String
    },
    processor: {
        type: String
    },
    numberOfCores: {
        type: String
    },
    ram: {
        type: String
    },
    storageCapacity: {
        type: String
    },
    storageType: {
        type: String
    },
    displaySize: {
        type: String
    },
    graphicCard: {
        type: String,
    },
    graphicCardMemory: {
        type: String
    },
    os: {
        type: String
    },
    description: {
        type: String
    }
},{timestamps: true});

const LaptopAndComputer = mongoose.model('LaptopAndComputer', laptopAndComputerSchema);

module.exports = LaptopAndComputer;