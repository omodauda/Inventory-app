const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema ({
    userId: {
        type: schema.Types.ObjectId,
        ref: 'Auth'
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
    avatar:{
        image: {
            type: String
        },
        cloudinary_id: {
            type: String
        }
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        type: String
    },
    posts: [{
        type: schema.Types.ObjectId,
        refPath: 'onModel'
    }],
    onModel: {
        type: [String]
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;