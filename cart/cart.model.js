const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    recipe_id: {type: mongoose.Schema.Types.ObjectId, ref: "recipes"},
    amount: Number,
    note: String,
    cart_status : {
        type: String,
        enum : ['ACTIVE', 'DELETED'],
        default: 'ACTIVE'
    }
});

module.exports = mongoose.model('carts', cartSchema);