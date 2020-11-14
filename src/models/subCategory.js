const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }]
}, {timestamps: true});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;