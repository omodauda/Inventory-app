const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    posts: [{
        type: schema.Types.ObjectId,
        refPath: 'onModel'
    }],
    onModel: [String]

}, {timestamps: true});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;