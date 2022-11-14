const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: String,
    picture: String,
    price: Number,
    ingredients: [{
        ingredient_id : {type: mongoose.Schema.Types.ObjectId, ref: "ingredients"},
        stock_used: Number
    }],
    recipe_status: {
        type: String,
        enum: ["ACTIVE", "UNPUBLISH", "DELETED"],
        default: "ACTIVE"
    }
});

module.exports = mongoose.model("recipes", recipeSchema);