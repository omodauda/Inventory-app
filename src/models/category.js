const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'subCategory'
    }]

}, {timestamps: true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;