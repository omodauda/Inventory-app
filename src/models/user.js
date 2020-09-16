const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    method: {
        type: String,
        required: true,
        enum: ["local", "google"]
    },
    local: {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            minlength: 5
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            lowercase: true
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
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
        type: Number
    },
    address: {
        type: [String],
        default: undefined
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'order'
    }]
}, {timestamps: true});

//hash password before saving to database
userSchema.pre('save', async function(next) {
    try{
        //check if the signup method is local
        //if !== local, continue to saving the user doc.
        if(this.method !== 'local'){
            next();
        }
        //Generate salt
        const salt = await bcrypt.genSalt(10);
        //Generate a hashed password
        const hashedPassword = await bcrypt.hash(this.local.password, salt);
        //Re-assign hashed password over plain text password
        this.local.password = hashedPassword;
        next()
    }
    catch(error){
        next(error);
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;