const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    user_status : {
        type: String,
        enum : ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }, 
    security_answer: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 1000000
    },
    user_type: [{
        name: String,
        view: Boolean
    }]
}, {versionKey:false, timestamps: true});

module.exports = mongoose.model("users", userSchema);