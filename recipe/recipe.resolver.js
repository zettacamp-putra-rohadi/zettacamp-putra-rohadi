const recipeModel = require('./recipe.model');
const ingredientModel = require('../ingredient/ingredient.model');
const mongoose = require('mongoose');

const createRecipe = async (parent, {name, picture, price, ingredients}, context) => {
    const newRecipe = new recipeModel({
        name,
        picture,
        price,
        ingredients,
        recipe_status: "UNPUBLISH"
    });
    const result = await newRecipe.save();
    return result;
}

const updateRecipe = async (parent, {_id, name, picture, price, ingredients}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new Error('Recipe tidak ditemukan');
    }
    if(recipe.recipe_status === 'DELETED'){
        throw new Error('Recipe telah dihapus');
    }

    let queryUpdate = {};
    
    name ? queryUpdate.name = name : null;
    picture ? queryUpdate.picture = picture : null;
    price ? queryUpdate.price = price : null;
    ingredients ? queryUpdate.ingredients = ingredients : null;

    const result = await recipeModel.findByIdAndUpdate(_id, queryUpdate, {new: true});
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
    if(recipe.recipe_status === 'ACTIVE'){
        throw new Error('Recipe masih digunakan');
    }
    const result = await recipeModel.findOneAndUpdate({_id: _id}, {
        recipe_status: 'DELETED'
    }, {new: true});
    return result;
}

const updateRecipeStatus = async (parent, {_id, recipe_status}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new Error('Recipe tidak ditemukan');
    }
    if(recipe_status === 'UNPUBLISH'){
        const result = await recipeModel.findOneAndUpdate({_id: _id}, {
            recipe_status: 'UNPUBLISH'
        }, {new: true});
        return result;
    }
    if(recipe_status === 'ACTIVE'){
        const result = await recipeModel.findOneAndUpdate({_id: _id}, {
            recipe_status: 'ACTIVE'
        }, {new: true});
        return result;
    }
}


const getAllRecipes = async (parent, {filter}, context) => {
    let aggregate = [];
    let query = {$and: []};

    query.$and.push({recipe_status: {$ne: 'DELETED'}});
    filter.recipe_name ? query.$and.push({name: new RegExp(filter.recipe_name, 'i')}) : null;

    aggregate.push({$match: query});
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
    let query = {$and: []};

    query.$and.push({recipe_status: {$ne: 'DELETED'}});
    query.$and.push({_id: mongoose.Types.ObjectId(_id)});

    aggregate.push({$match: query});
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

function calculateAvailableStock(listRecipe){
    var prevCalculate = 0;
    listRecipe.ingredients.forEach((ingredient) => {
        var calculateStock = Math.floor(
        (ingredient.ingredient_id.stock /= ingredient.stock_used)
        );
        if (prevCalculate !== 0) {
            if (calculateStock < prevCalculate) {
                prevCalculate = calculateStock;
            }
        } else {
            prevCalculate = calculateStock;
        }
    });
    return prevCalculate;
}

const getIngredientLoader = async function (parent, args, context) {
    if (parent.ingredient_id) {
        return await context.ingredientListLoader.load(parent.ingredient_id);}
};

const getAvailableStock = async function (parent, args, context) {
    let availableStock = [];
    for (rec of parent.ingredients) {
        const ingredient = await ingredientModel.findById(rec.ingredient_id);
        availableStock.push(Math.floor(ingredient.stock / rec.stock_used));
    }
    return Math.min(...availableStock);;
};

module.exports = {
    Query : {
        getAllRecipes,
        getOneRecipe
    },
    Mutation : {
        createRecipe,
        updateRecipe,
        deleteRecipe,
        updateRecipeStatus,
    },
    ListIngredient :{
        ingredient_id: getIngredientLoader
    },
    GetRecipe: {
        availableStock : getAvailableStock
    }
}