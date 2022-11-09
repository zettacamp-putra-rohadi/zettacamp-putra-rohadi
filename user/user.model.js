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
    }
}, {versionKey:false});

module.exports = mongoose.model("users", userSchema);