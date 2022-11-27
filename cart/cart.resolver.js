const cartModel = require('./cart.model');
const recipeModel = require('../recipe/recipe.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

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
    return {status: 'Cart added successfully'};
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
        throw new GraphQLError('Cart not found', {
            extensions: {
                code: "cart/cart-not-found",
            }
        });
    }
    if(cart.cart_status === 'DELETED'){
        throw new GraphQLError('Cart not found', {
            extensions: {
                code: "cart/cart-not-found",
            }
        });
    }
    const queryUpdate = {};

    menu.recipe_id ? queryUpdate.recipe_id = recipeId : null;
    menu.amount ? queryUpdate.amount = amount : null;
    menu.note ? queryUpdate.note = menu.note : null;

    const result = await cartModel.findOneAndUpdate(
        {user_id: userId, recipe_id : recipeId, cart_status : 'ACTIVE'}, queryUpdate, {new: true});
    return result;
}

const deleteCart = async (parent, {_id}, context) => {
    const cart = await cartModel.findOne({_id: mongoose.Types.ObjectId(_id)});
    if(!cart){
        throw new GraphQLError('Cart not found', {
            extensions: {
                code: "cart/cart-not-found",
            }
        });
    }
    cart.cart_status = 'DELETED';
    const result = await cart.save();
    return result;
}

const getAllCarts = async (parent, {page, limit}, context) => {
    let aggregate = [];
    let query = {$and: []};

    query.$and.push({cart_status: {$eq: 'ACTIVE'}});
    
    //user id dr token
    if (context.role === 'USER') {
        query.$and.push({user_id: mongoose.Types.ObjectId(context.user_id)});
    }
    aggregate.push({$match: query});

    const getCarts = await cartModel.aggregate(aggregate);
    const total = getCarts.length;
    let totalPrice = 0;

    //calculate total price
    for (data of getCarts){
        const recipe = await recipeModel.findById(data.recipe_id);
        totalPrice += recipe.price * data.amount;
    }
    
    if (page !== null) { 
        aggregate.push({$skip: page * limit});
    } else {
        throw new GraphQLError('Page required', {
            extensions: {
                code: "cart/page-required",
            }
        });
    }

    if (limit !== null && limit > 0) {
        aggregate.push({$limit: limit});
    } else {
        throw new GraphQLError('Limit is required and greater than 0', {
            extensions: {
                code: "cart/limit-required",
            }
        });
    }
    try {
        const carts = await cartModel.aggregate(aggregate);
        
        if(carts.length == 0){
            throw error;
        }
        
        return {
            listCart : carts,
            total : total,
            totalPrice : totalPrice
        };
    } catch (error) {
        throw new GraphQLError('Cart not found', {
            extensions: {
                code: "cart/cart-not-found",
            }
        });
    }
}

const getOneCart = async (parent, {id}, context) => {
    try{
        const cart = await cartModel.findById(id);
        if(!cart){
            throw error;
        }
        return cart;
    } catch (error) {
        throw new GraphQLError('Cart not found', {
            extensions: {
                code: "cart/cart-not-found",
            }
        });
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