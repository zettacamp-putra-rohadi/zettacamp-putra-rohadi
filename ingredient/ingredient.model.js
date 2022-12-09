const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    ingredient_status : {
        type: String,
        enum : ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    }
},{versionKey:false, timestamps: true})

module.exports = mongoose.model("ingredients", ingredientSchema);