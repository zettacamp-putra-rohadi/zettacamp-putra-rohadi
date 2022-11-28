const ingredientModel = require('./ingredient.model');
const recipeModel = require('../recipe/recipe.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

const createIngredient = async (parent, {name, stock, unit}, context) => {
    const ingredient = await ingredientModel.findOne({name: name});
    if(ingredient && ingredient.ingredient_status === 'ACTIVE'){
        throw new GraphQLError('Name of ingredient already used', {
            extensions: {
                code: "ingredient/name-already-used",
            }
        });
    }
    if(ingredient && ingredient.ingredient_status === 'DELETED'){
        const updateStatus = await ingredientModel.findOneAndUpdate({name: name}, {
            stock : stock,
            unit : unit,
            ingredient_status: 'ACTIVE'
        }, {new: true});
        return updateStatus;
    }
    const newIngredient = new ingredientModel({
        name: name,
        stock: stock,
        unit: unit,
        ingredient_status: 'ACTIVE'
    });
    const result = await newIngredient.save();
    return result;
}

const updateIngredient = async (parent, {_id, stock, unit}, context) => {
    if(stock < 0){
        throw new GraphQLError('Stock Cannot Be Less Than 0', {
            extensions: {
                code: "ingredient/stock-cannot-less-than-0",
            }
        });
    }
    const ingredient = await ingredientModel.findOne({_id: _id});
    if(!ingredient){
        throw new GraphQLError('Ingredient not found', {
            extensions: {
                code: "ingredient/ingredient-not-found",
            }
        });
    }
    if(ingredient.ingredient_status === 'DELETED'){
        throw new GraphQLError('Ingredient not found', {
            extensions: {
                code: "ingredient/ingredient-not-found",
            }
        });
    }
    const result = await ingredientModel.findOneAndUpdate({_id: _id}, {
        stock: stock,
        unit: unit
    }, {new: true});
    return result;
}

const deleteIngredient = async (parent, {_id}, context) => {
    const ingredient = await ingredientModel.findOne({_id: _id});
    const checkRecipe = await recipeModel.find({ingredients: {$elemMatch: {ingredient_id: _id}}},{recipe_status:'ACTIVE'});
    if(!ingredient){
        throw new GraphQLError('Ingredient not found', {
            extensions: {
                code: "ingredient/ingredient-not-found",
            }
        });
    }
    if(ingredient.ingredient_status === 'DELETED'){
        throw new GraphQLError('Ingredient not found', {
            extensions: {
                code: "ingredient/ingredient-not-found",
            }
        });
    }
    if(checkRecipe.length > 0){
        throw new GraphQLError('Ingredients Still Used In Recipes', {
            extensions: {
                code: "ingredient/ingredient-still-used-in-recipes",
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
            throw new GraphQLError('Stock Cannot Be Less Than 0', {
                extensions: {
                    code: "ingredient/stock-cannot-less-than-0",
                }
            });
        }
    }

    aggregate.push({$match: query});

    const total = await ingredientModel.aggregate(aggregate).count('total');

    if (filter.page !== null) { 
        aggregate.push({$skip: filter.page * filter.limit});
    } else {
        throw new GraphQLError('Page required', {
            extensions: {
                code: "ingredient/page-required",
            }
        });
    }

    if (filter.limit !== null && filter.limit > 0) {
        aggregate.push({$limit: filter.limit});
    } else {
        throw new GraphQLError('Limit is required and greater than 0', {
            extensions: {
                code: "ingredient/limit-required",
            }
        });
    }

    //add new field list of recipes that use the ingredient
    aggregate.push( { $addFields : {list_recipe : []} } );

    try {
        const ingredients = await ingredientModel.aggregate(aggregate);
        const recipes = await recipeModel.aggregate([
            {$match: {recipe_status: 'ACTIVE'}},
            {$project: {
                _id: 1,
                name: 1,
                ingredients: 1
            }}
        ]);

        //check ingredient in recipe
        for (const [index, ingredient] of ingredients.entries()) {
            for (recipe of recipes) {
                for (recipeIngredient of recipe.ingredients) {
                if (ingredient._id.toString() === recipeIngredient.ingredient_id.toString()) {
                    ingredients[index].list_recipe.push(recipe.name);
                }
                }
            }
        }
        
        console.log(ingredients);

        if(ingredients.length == 0){
            throw error;
        }
        return {
            listIngredient: ingredients,
            total : total[0].total
        };
    } catch (error) {
        throw new GraphQLError('Ingredient not found', {
            extensions: {
                code: "ingredient/ingredient-not-found",
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
        throw new GraphQLError('Ingredient not found', {
            extensions: {
                code: "ingredient/ingredient-not-found",
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