const recipeModel = require('./recipe.model');
const ingredientModel = require('../ingredient/ingredient.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

const createRecipe = async (parent, {name, picture, price, discount, ingredients, discount_status}, context) => {
    let priceAfterDiscount = null;
    if(discount_status === 'ACTIVE') {
        if(discount < 0 || discount > 100){
            throw new GraphQLError('Discount must be between 0 and 100', {
                extensions: {
                    code: "recipe/discount-must-be-between-0-and-100",
                }
            });
        } else {
            priceAfterDiscount = price - (price * discount / 100);
        }
    }
    const newRecipe = new recipeModel({
        name,
        picture,
        price,
        discount,
        price_after_discount : priceAfterDiscount,
        ingredients,
        recipe_status: "UNPUBLISH",
        discount_status: discount_status
    });
    const result = await newRecipe.save();
    return result;
}

const updateRecipe = async (parent, {_id, name, picture, price, discount, ingredients, discount_status}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
    if(recipe.recipe_status === 'DELETED'){
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
    if(recipe.recipe_status === 'ACTIVE'){
        throw new GraphQLError('Recipe are still used', {
            extensions: {
                code: "recipe/recipe-still-used",
            }
        });
    }

    let queryUpdate = {
        price : price,
        discount_status : discount_status
    };

    name ? queryUpdate.name = name : null;
    picture ? queryUpdate.picture = picture : null;
    ingredients ? queryUpdate.ingredients = ingredients : null;

    let priceAfterDiscount = 0;
    if(discount_status === 'ACTIVE') {
        if(discount < 0 || discount > 100){
            throw new GraphQLError('Discount must be between 0 and 100', {
                extensions: {
                    code: "recipe/discount-must-be-between-0-and-100",
                }
            });
        } else {
            queryUpdate.discount = discount;
            priceAfterDiscount = price - (price * discount / 100);
            queryUpdate.price_after_discount = priceAfterDiscount;
        }
    }
    const result = await recipeModel.findByIdAndUpdate(_id, queryUpdate, {new: true});
    return result;
}

const deleteRecipe = async (parent, {_id}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
    if(recipe.recipe_status === 'DELETED'){
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
    if(recipe.recipe_status === 'ACTIVE'){
        throw new GraphQLError('Recipe are still used', {
            extensions: {
                code: "recipe/recipe-still-used",
            }
        });
    }
    const result = await recipeModel.findOneAndUpdate({_id: _id}, {
        recipe_status: 'DELETED'
    }, {new: true});
    return result;
}

const updateRecipeStatus = async (parent, {_id, recipe_status}, context) => {
    const recipe = await recipeModel.findOne({_id: _id});
    if(!recipe){
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
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
    
    if (context.role === 'USER') {
        query.$and.push({recipe_status: 'ACTIVE'});
    } else {
        if (filter.recipe_status) {
            query.$and.push({recipe_status: filter.recipe_status});
        }
        query.$and.push({recipe_status: {$ne: 'DELETED'}});
    }

    filter.recipe_name ? query.$and.push({name: new RegExp(filter.recipe_name, 'i')}) : null;

    aggregate.push({$match: query});
    
    if (filter.page !== null) { 
        aggregate.push({$skip: filter.page * filter.limit});
    } else {
        throw new GraphQLError('Page required', {
            extensions: {
                code: "recipe/page-required",
            }
        });
    }

    if (filter.limit !== null && filter.limit > 0) {
        aggregate.push({$limit: filter.limit});
    } else {
        throw new GraphQLError('Limit is required and greater than 0', {
            extensions: {
                code: "recipe/limit-required",
            }
        });
    }

    try {
        const recipes = await recipeModel.aggregate(aggregate);
        const total = recipes.length;
        if(recipes.length == 0){
            throw error;
        }
        return {
            listRecipe: recipes,
            total
        };
    } catch (error) {
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
}

const getAllRecipesPublic = async (parent, {filter}, context) => {
    let aggregate = [];
    let query = {$and: []};

    query.$and.push({recipe_status: 'ACTIVE'});
    filter.recipe_name ? query.$and.push({name: new RegExp(filter.recipe_name, 'i')}) : null;

    aggregate.push({$match: query});

    const total = await recipeModel.aggregate(aggregate).count('total');
    
    if (filter.page !== null) { 
        aggregate.push({$skip: filter.page * filter.limit});
    } else {
        throw new GraphQLError('Page required', {
            extensions: {
                code: "recipe/page-required",
            }
        });
    }

    if (filter.limit !== null && filter.limit > 0) {
        aggregate.push({$limit: filter.limit});
    } else {
        throw new GraphQLError('Limit is required and greater than 0', {
            extensions: {
                code: "recipe/limit-required",
            }
        });
    }

    try {
        const recipes = await recipeModel.aggregate(aggregate);
        if(recipes.length == 0){
            throw error
        }
        return {
            listRecipe: recipes,
            total : total[0].total
        };
    } catch (error) {
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
}

const getOneRecipe = async (parent, {_id}, context) => {
    let aggregate = [];
    let query = {$and: []};

    if (context.role === 'USER') {
        query.$and.push({recipe_status: 'ACTIVE'});
    } else {
        query.$and.push({recipe_status: {$ne: 'DELETED'}});
    }

    query.$and.push({_id: mongoose.Types.ObjectId(_id)});

    aggregate.push({$match: query});
    try {
        const recipe = await recipeModel.aggregate(aggregate);
        if(recipe.length == 0){
            throw error;
        }
        return recipe[0];
    } catch (error) {
        throw new GraphQLError('Recipe not found', {
            extensions: {
                code: "recipe/recipe-not-found",
            }
        });
    }
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
        getOneRecipe,
        getAllRecipesPublic
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