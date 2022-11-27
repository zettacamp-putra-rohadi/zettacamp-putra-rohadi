const mongoose = require('mongoose');
const moment = require('moment');

const transactionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    menu : [
        {
            recipe_id: {type: mongoose.Schema.Types.ObjectId, ref: "recipes"},
            amount: Number,
            note: String
        }
    ],
    total_price: Number,
    order_status: {
        type: String,
        enum: ["SUCCESS", "FAILED"],
        default: "SUCCESS"
    },
    order_date: {
        type: String, 
        default: moment(new Date()).locale('id').format('LL')
    },
    transaction_status: {
        type: String,
        enum: ["ACTIVE", "DELETED"],
        default: "ACTIVE"
    }
});

module.exports = mongoose.model("transactions", transactionSchema);