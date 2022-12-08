const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: String,
    picture: String,
    price: Number,
    description: String,
    discount: {
        type: Number,
        default: 0
    },
    price_after_discount: {
        type: Number,
        default: 0
    },
    ingredients: [{
        ingredient_id : {type: mongoose.Schema.Types.ObjectId, ref: "ingredients",  required: true},
        stock_used: Number
    }],
    recipe_status: {
        type: String,
        enum: ["ACTIVE", "UNPUBLISH", "DELETED"],
        default: "UNPUBLISH"
    },
    discount_status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    offer_status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "INACTIVE"
    }
},{versionKey:false, timestamps: true});

module.exports = mongoose.model("recipes", recipeSchema);