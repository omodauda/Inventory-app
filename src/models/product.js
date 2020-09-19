const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    category: {
        type: String,
        enum: [
            "Phones",
            "Electronics",
            "Home, Furniture & Appliances",
            "Fashion",
            "Health & Beauty",
            "Property",
            "Automobiles",
            "Babies & Kids",
            "Animals & Pets",
            "Agriculture & Food",
            "Commercial Equipment & Tools"
        ],
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Sold"],
        default: "Available"
    }
    
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;