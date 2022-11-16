const ingredientModel = require('./ingredient.model');
const mongoose = require('mongoose');

const createIngredient = async (parent, {name, stock}, context) => {
    const ingredient = await ingredientModel.findOne({name: name});
    if(ingredient && ingredient.ingredient_status === 'ACTIVE'){
        throw new Error('Nama bahan telah digunakan')
    }
    if(ingredient && ingredient.ingredient_status === 'DELETED'){
        const updateStatus = await ingredientModel.findOneAndUpdate({name: name}, {
            stock : stock,
            ingredient_status: 'ACTIVE'
        }, {new: true});
        return updateStatus;
    }
    const newIngredient = new ingredientModel({
        name: name,
        stock: stock,
        ingredient_status: 'ACTIVE'
    });
    const result = await newIngredient.save();
    return result;
}

const updateIngredient = async (parent, {_id, stock}, context) => {
    if(stock < 0){
        throw new Error('Stock tidak boleh kurang dari 0');
    }
    const ingredient = await ingredientModel.findOne({_id: _id});
    if(!ingredient){
        throw new Error('Ingredient tidak ditemukan');
    }
    if(ingredient.ingredient_status === 'DELETED'){
        throw new Error('Ingredient telah dihapus');
    }
    const result = await ingredientModel.findOneAndUpdate({_id: _id}, {
        stock: stock
    }, {new: true});
    return result;
}

const deleteIngredient = async (parent, {_id}, context) => {
    const ingredient = await ingredientModel.findOne({_id: _id});
    if(!ingredient){
        throw new Error('Ingredient tidak ditemukan');
    }
    if(ingredient.ingredient_status === 'DELETED'){
        throw new Error('Ingredient telah dihapus');
    }
    const result = await ingredientModel.findOneAndUpdate({_id: _id}, {
        ingredient_status: 'DELETED'
    }, {new: true});
    return result;
}

const getAllIngredients = async (parent, {filter}, context) => {
    let aggregate = [];
    let query = {$and: []};

    query.$and.push({ingredient_status: {$eq: 'ACTIVE'}});
    
    filter.name ? query.$and.push({name: filter.name}) : null;

    if (filter.stock) {
        if (filter.stock > 0) {
            query.$and.push({stock: {$gte: filter.stock}});
        } else {
            throw new Error('Stock harus lebih dari 0');
        }
    }
    aggregate.push({$match: query});
    aggregate.push({$skip: filter.page * filter.limit});
    aggregate.push({$limit: filter.limit});
    
    try {
        const ingredients = await ingredientModel.aggregate(aggregate);
        const total = ingredients.length;
        if(ingredients.length == 0){
            throw new Error('Ingredient tidak ditemukan');
        }
        return {
            listIngredient: ingredients,
            total
        };
    } catch (error) {
        throw new Error(error);
    }
}

const getOneIngredient = async (parent, {_id}, context) => {
    let aggregate = [];
    let query= {$and: []};
    query.$and.push({ingredient_status: {$eq: 'ACTIVE'}});
    query.$and.push({_id: mongoose.Types.ObjectId(_id)});
    aggregate.push({$match: query});
    try {
        const ingredient = await ingredientModel.aggregate(aggregate);
        if(ingredient.length == 0){
            throw new Error('Ingredient tidak ditemukan');
        }
        return ingredient[0];
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    Query : {
        getAllIngredients,
        getOneIngredient,
    },
    Mutation : {
        createIngredient,
        updateIngredient,
        deleteIngredient,
    }
}