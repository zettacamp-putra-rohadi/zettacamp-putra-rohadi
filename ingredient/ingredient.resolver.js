const ingredientModel = require('./ingredient.model');
const recipeModel = require('../recipe/recipe.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

const createIngredient = async (parent, {name, stock}, context) => {
    const ingredient = await ingredientModel.findOne({name: name});
    if(ingredient && ingredient.ingredient_status === 'ACTIVE'){
        throw new GraphQLError('Nama Ingredient Telah Digunakan', {
            extensions: {
                code: 409,
            }
        });
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
        throw new GraphQLError('Stock Tidak Boleh Kurang Dari 0', {
            extensions: {
                code: 400,
            }
        });
    }
    const ingredient = await ingredientModel.findOne({_id: _id});
    if(!ingredient){
        throw new GraphQLError('Ingredient Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    if(ingredient.ingredient_status === 'DELETED'){
        throw new GraphQLError('Ingredient Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    const result = await ingredientModel.findOneAndUpdate({_id: _id}, {
        stock: stock
    }, {new: true});
    return result;
}

const deleteIngredient = async (parent, {_id}, context) => {
    const ingredient = await ingredientModel.findOne({_id: _id});
    const checkRecipe = await recipeModel.find({ingredients: {$elemMatch: {ingredient_id: _id}}},{recipe_status:'ACTIVE'});
    if(!ingredient){
        throw new GraphQLError('Ingredient Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    if(ingredient.ingredient_status === 'DELETED'){
        throw new GraphQLError('Ingredient Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    if(checkRecipe.length > 0){
        throw new GraphQLError('Ingredient Masih Digunakan Diresep', {
            extensions: {
                code: 409,
            }
        });
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
            throw new GraphQLError('Stock harus lebih dari 0', {
                extensions: {
                    code: 400,
                }
            });
        }
    }

    aggregate.push({$match: query});

    if (filter.page !== null) { 
        aggregate.push({$skip: filter.page * filter.limit});
    } else {
        throw new GraphQLError('Page harus diisi', {
            extensions: {
                code: 400,
            }
        });
    }

    if (filter.limit !== null && filter.limit > 0) {
        aggregate.push({$limit: filter.limit});
    } else {
        throw new GraphQLError('limit harus diisi dan lebih dari 0', {
            extensions: {
                code: 400,
            }
        });
    }

    try {
        const ingredients = await ingredientModel.aggregate(aggregate);
        const total = ingredients.length;
        if(ingredients.length == 0){
            throw error;
        }
        return {
            listIngredient: ingredients,
            total
        };
    } catch (error) {
        throw new GraphQLError('Ingredient Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
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
            throw error;
        }
        return ingredient[0];
    } catch (error) {
        throw new GraphQLError('Ingredient Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
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