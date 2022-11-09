const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    stock: Number,
    ingredient_status : {
        type: String,
        enum : ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    }
})

module.exports = mongoose.model("ingredients", ingredientSchema);