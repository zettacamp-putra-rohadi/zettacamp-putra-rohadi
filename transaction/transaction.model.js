const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    menu : [
        {
            recipe_id: {type: mongoose.Schema.Types.ObjectId, ref: "recipes"},
            amount: Number,
            note: String
        }
    ],
    order_status: {
        type: String,
        enum: ["SUCCESS", "FAILED"],
        default: "SUCCESS"
    },
    order_date: {type: Date, default: Date.now},
    transaction_status: {
        type: String,
        enum: ["ACTIVE", "DELETED"],
        default: "ACTIVE"
    }
});

module.exports = mongoose.model("transactions", transactionSchema);