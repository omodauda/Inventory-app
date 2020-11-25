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
    },
    status: {
        type: String,
        default: "Reviewing",
        enum: ["Active", "Reviewing", "Closed", "Declined"]
    },
    promotion: {
        status: {
            type: Boolean,
            default: false
        },
        ref: {
            type: String
        },
        type:{
            type: String,
            enum: ["Top-week", "Top-month", "Boost-premium"]
        },
        isVerified:{
            type: Boolean
        },
        startDate: {
            type: Date
        },
        dueDate:{
            type: Date
        }
    }
}, {timestamps: true});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;