const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'auth'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;