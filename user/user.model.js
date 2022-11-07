const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchemas = new Schema({
    name: String,
    email: {type: String, unique: true},
    hashed_password: String
},{versionKey: false});

module.exports = mongoose.model('users', userSchemas);