const cartModel = require('./cart.model');
const mongoose = require('mongoose');

const createCart = async (parent, {menu}, context) => {
    const newCart = new cartModel({
        user_id: context.user_id,
        recipe_id : menu.recipe_id,
        amount : menu.amount,
        note : menu.note,
        cart_status: 'ACTIVE'
    });
    const result = await newCart.save();
    return result;
}

const updateCart = async (parent, {_id, menu}, context) => {
    const cart = await cartModel.findOne({_id: _id});
    if(!cart){
        throw new Error('Cart tidak ditemukan');
    }
    if(cart.cart_status === 'DELETED'){
        throw new Error('Cart telah dihapus');
    }
    const queryUpdate = {};

    menu[0].recipe_id ? queryUpdate.recipe_id = menu[0].recipe_id : null;
    menu[0].amount ? queryUpdate.amount = menu[0].amount : null;
    menu[0].note ? queryUpdate.note = menu[0].note : null;

    const result = await cartModel.findByIdAndUpdate(_id, queryUpdate, {new: true});
    return result;
}

const deleteCart = async (parent, {_id}, context) => {
    const cart = await cartModel.findOne({_id: mongoose.Types.ObjectId(_id)});
    if(!cart){
        throw new Error('Cart tidak ditemukan');
    }
    cart.cart_status = 'DELETED';
    const result = await cart.save();
    return result;
}

const getAllCarts = async (parent, {_id}, context) => {
    let aggregate = [];
    let query = {$and: []};
    //user id dr token
    query.$and.push({cart_status: {$eq: 'ACTIVE'}});
    query.$and.push({user_id: mongoose.Types.ObjectId(_id)});
    aggregate.push({$match: query});
    try {
        const carts = await cartModel.aggregate(aggregate);
        if(carts.length == 0){
            throw new Error('Cart tidak ditemukan');
        }
        return {
            listCart : carts
        };
    } catch (error) {
        throw new Error(error);
    }
}

const getOneCart = async (parent, {id}, context) => {
    try{
        const cart = await cartModel.findById(id);
        if(!cart){
            throw new Error('Cart tidak ditemukan');
        }
        return cart;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    Query : {
        getAllCarts,
        getOneCart
    },
    Mutation : {
        createCart,
        updateCart,
        deleteCart
    }
}