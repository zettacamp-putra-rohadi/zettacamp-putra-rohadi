const cartModel = require('./cart.model');
const recipeModel = require('../recipe/recipe.model');
const mongoose = require('mongoose');

const createCart = async (parent, {menu}, context) => {
    const userId = context.user_id;
    const recipeId = menu.recipe_id;
    let amount = menu.amount;
    const cart = await cartModel.findOne({user_id: userId, recipe_id: recipeId, cart_status: 'ACTIVE'});
    if(cart){
        amount = cart.amount + menu.amount;
    }
    try{
    const newCart = await cartModel.updateOne(
        {user_id: userId, recipe_id : recipeId, cart_status : 'ACTIVE'},
        {
            user_id: context.user_id,
            recipe_id : menu.recipe_id,
            amount : amount,
            note : menu.note,
            cart_status: 'ACTIVE'
        },
        {upsert: true}
    );
    return {status: 'Cart berhasil ditambahkan'};
    } catch (error) {
        throw new Error(error);
    }
}

const updateCart = async (parent, {menu}, context) => {
    const userId = context.user_id;
    const recipeId = menu.recipe_id;
    let amount = menu.amount;
    const cart = await cartModel.findOne({user_id: userId, recipe_id : recipeId, cart_status : 'ACTIVE'});
    if(!cart){
        throw new Error('Cart tidak ditemukan');
    }
    if(cart.cart_status === 'DELETED'){
        throw new Error('Cart telah dihapus');
    }
    const queryUpdate = {};

    menu.recipe_id ? queryUpdate.recipe_id = recipeId : null;
    menu.amount ? queryUpdate.amount = amount : null;
    menu.note ? queryUpdate.note = menu.note : null;

    const result = await cartModel.findOneAndUpdate(
        {user_id: userId, recipe_id : recipeId, cart_status : 'ACTIVE'}, queryUpdate, {new: true});
        console.log(result);
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

const getAllCarts = async (parent, {page, limit}, context) => {
    let aggregate = [];
    let query = {$and: []};
    //user id dr token
    query.$and.push({cart_status: {$eq: 'ACTIVE'}});
    if (context.role === 'USER') {
        query.$and.push({user_id: mongoose.Types.ObjectId(context.user_id)});
    }
    aggregate.push({$match: query});
    
    if (page !== null) { 
        aggregate.push({$skip: page * limit});
    } else {
        throw new Error('Page harus diisi');
    }

    if (limit !== null && limit > 0) {
        aggregate.push({$limit: limit});
    } else {
        throw new Error('limit harus diisi dan lebih dari 0');
    }
    try {
        const carts = await cartModel.aggregate(aggregate);
        const total = carts.length;
        let totalPrice = 0;
        
        if(carts.length == 0){
            throw new Error('Cart tidak ditemukan');
        }

        for (data of carts){
            const recipe = await recipeModel.findById(data.recipe_id);
            totalPrice += recipe.price * data.amount;
        }
        
        return {
            listCart : carts,
            total : total,
            totalPrice : totalPrice
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

const getRecipeLoader = async (parent, ags, context) => {
    if (parent.recipe_id){
        return await context.RecipeLoader.load(parent.recipe_id);
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
    },
    Cart : {
        recipe_id : getRecipeLoader
    }
}