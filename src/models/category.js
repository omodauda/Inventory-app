const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {timestamps: true});

categorySchema.virtual('ads', {
    ref: 'Ad',
    localField: 'name',
    foreignField: 'category',
    // count: true
});

categorySchema.virtual('adsCount', {
    ref: 'Ad',
    localField: 'name',
    foreignField: 'category',
    count: true
});

categorySchema.set('toJSON', {virtuals: true})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;