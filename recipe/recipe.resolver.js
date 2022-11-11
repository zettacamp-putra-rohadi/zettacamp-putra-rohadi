const recipeModel = require('./recipe.model');
const mongoose = require('mongoose');

const createRecipe = async (parent, {name, ingredients}, context) => {
    const newRecipe = new recipeModel({
        name,
        ingredients,
        recipe_status: "ACTIVE"
    });
    const result = await newRecipe.save();
    return result;
}

const updateRecipe = async (parent, {_id, name, ingredients}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new Error('Recipe tidak ditemukan');
    }
    if(recipe.recipe_status === 'DELETED'){
        throw new Error('Recipe telah dihapus');
    }
    const result = await recipeModel.findOneAndUpdate({_id: _id}, {
        name: name,
        ingredients: ingredients
    }, {new: true});
    return result;
}

const deleteRecipe = async (parent, {_id}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new Error('Recipe tidak ditemukan');
    }
    if(recipe.recipe_status === 'DELETED'){
        throw new Error('Recipe telah dihapus');
    }
    const result = await recipeModel.findOneAndUpdate({_id: _id}, {
        recipe_status: 'DELETED'
    }, {new: true});
    return result;
}

const getAllRecipes = async (parent, {filter}, context) => {
    //lebih dari satu match
    let aggregate = [];

    aggregate.push({$match: {recipe_status: {$ne: 'DELETED'}}});
    filter.recipe_name ? aggregate.push({$match: {name: new RegExp(filter.recipe_name, 'i')}}) : null;
    aggregate.push({$skip: filter.page * filter.limit});
    aggregate.push({$limit: filter.limit});
    try {
        const recipes = await recipeModel.aggregate(aggregate);
        const total = recipes.length;
        if(recipes.length == 0){
            throw new Error('Recipe tidak ditemukan');
        }
        return {
            listRecipe: recipes,
            total
        };
    } catch (error) {
        throw new Error(error);
    }
}

const getOneRecipe = async (parent, {_id}, context) => {
    let aggregate = [];
    aggregate.push({$match: {recipe_status: {$ne: 'DELETED'}}});
    aggregate.push({$match: {_id: mongoose.Types.ObjectId(_id)}});
    try {
        const recipe = await recipeModel.aggregate(aggregate);
        if(recipe.length == 0){
            throw new Error('recipe tidak ditemukan');
        }
        return recipe[0];
    } catch (error) {
        throw new Error(error);
    }
}

const getIngredientLoader = async function (parent, args, context) {
    if (parent.ingredient_id) {
        return await context.ingredientListLoader.load(parent.ingredient_id);}
};

module.exports = {
    Query : {
        getAllRecipes,
        getOneRecipe
    },
    Mutation : {
        createRecipe,
        updateRecipe,
        deleteRecipe
    },
    ListIngredient :{
        ingredient_id: getIngredientLoader
    }
}