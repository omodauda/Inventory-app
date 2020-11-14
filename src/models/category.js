const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subCategories: [{
        type: schema.Types.ObjectId,
        ref: 'SubCategory'
    }]

}, {timestamps: true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;