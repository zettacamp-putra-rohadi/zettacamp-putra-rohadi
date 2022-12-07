const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    recipe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes',
        required: true,
    },
    favorite_status : {
        type: String,
        enum : ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    }
},{versionKey:false, timestamps: true});

module.exports = mongoose.model("favorites", favoriteSchema);
