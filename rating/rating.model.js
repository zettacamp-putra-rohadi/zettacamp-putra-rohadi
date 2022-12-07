const mongoose = require('mongoose');
const moment = require('moment');

const ratingSchema = new mongoose.Schema({
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
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transactions',
        required: true,
    },
    rating_value: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
    },
    rating_date : {
        type: String,
        default: moment(new Date()).locale('id').format('LL')
    }
},{versionKey:false, timestamps: true})

module.exports = mongoose.model("ratings", ratingSchema);