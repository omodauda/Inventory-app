const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tabletSchema = new schema({
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
        default: "Reviewing",
        enum: ["Active", "Reviewing", "Closed", "Declined"]
    },
    promotion: {
        status: {
            type: Boolean
        },
        ref: {
            type: String
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

const Tablet = mongoose.model("Tablet", tabletSchema);

module.exports = Tablet;