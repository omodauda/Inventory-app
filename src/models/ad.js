const mongoose = require('mongoose');
const schema = mongoose.Schema;

const adSchema = new schema({
    category:{
        type: String,
        required: true
    },
    subCategory: {
        type: String
    },
    user:{
        type: schema.Types.ObjectId,
        ref: "User"
    },
    product:{
        type: schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;