const transactionModel = require('./transaction.model');
const recipeModel = require('../recipe/recipe.model');
const ingredientModel = require('../ingredient/ingredient.model');
const cartModel = require('../cart/cart.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

const createTransaction = async (parent, {menu_input, totalPrice}, context) => {
    const userId = context.user_id;
    try {
        const isStock = await validateStockIngredient(menu_input);
        if (isStock.isStock) {
            const newTransaction = new transactionModel({
                user_id : userId,
                menu: menu_input,
                total_price: totalPrice,
                order_status: 'SUCCESS',
                order_date: Date.now(),
                transaction_status: 'ACTIVE',
            });
            const result = await newTransaction.save();
            //delete cart with userid
            const deleteCard = await cartModel.updateMany({user_id: userId}, {
                cart_status: 'DELETED'
            });
            return result;
        } else {
            const newTransaction = new transactionModel({
                user_id : userId,
                menu : menu_input,
                total_price: totalPrice,
                order_status: 'FAILED',
                order_date: Date.now(),
                transaction_status: 'ACTIVE',
            });
            const result = await newTransaction.save();
            result.DeclineRecipe = {
                isStock: isStock.isStock,
                recipe_id: isStock.recipe_id,
                name: isStock.name,
            };
            return result;
            // throw new GraphQLError('Stock Tidak Mencukupi', {
            //     extensions: {
            //         code: 400,
            //     }
            // });
        }
    } catch (error) {
        throw error;
    }
}

async function validateStockIngredient(recipe_input) {
    let ingredientsUsed = [];
    let isStock = true;
    let listRecipe = {};
    for (let a = 0; a < recipe_input.length; a++) {
        const recipe = await recipeModel.findById(recipe_input[a].recipe_id);
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ingredient = await ingredientModel.findById(recipe.ingredients[i].ingredient_id);
            if (ingredient.stock < (recipe.ingredients[i].stock_used * recipe_input[a].amount)) {
                isStock = false;
                listRecipe.isStock = isStock;
                listRecipe.recipe_id = recipe._id;
                listRecipe.recipe_name = recipe.name;
                return listRecipe;
            } else {
                ingredientsUsed.push({
                    ingredient_id: recipe.ingredients[i].ingredient_id,
                    amount: recipe.ingredients[i].stock_used * recipe_input[a].amount
                });
            }
        }
    }
    if (isStock) {
        const result = reduceingredientStock(ingredientsUsed);
        isStock = result;
        ingredientsUsed = [];
    }
    listRecipe.isStock = isStock;
    return listRecipe;
}

function reduceingredientStock(ingredientsUsed) {
    for (let i = 0; i < ingredientsUsed.length; i++) {
        ingredientModel.findByIdAndUpdate(ingredientsUsed[i].ingredient_id, {
            $inc: {
                stock: -ingredientsUsed[i].amount
            }
        }, (err, result) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
    return true;
}

const deleteTransaction = async (parent, {id}, context) => {
    const transaction = await transactionModel.findOne({_id: id});
    if(!transaction){
        throw new GraphQLError('Transaction Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    if(transaction.transaction_status === 'DELETED'){
        throw new GraphQLError('Transaction Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    const result = await transactionModel.findOneAndUpdate({_id: id}, {
        transaction_status: 'DELETED'
    }, {new: true});
    return result;
}

const getAllTransactions = async (parent, {filter}, context) => {
    let aggregate = [];
    let query = {$and: []};
    
    aggregate.push({$match:{transaction_status: 'ACTIVE'}});
    if (filter.last_name_user){
        const lookup = {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_data'
            }
        };
        aggregate.push(lookup);
        aggregate.push({$match: {'user_data.last_name': new RegExp(filter.last_name_user, 'i')}});
    }
    
    if (filter.recipe_name){
        const lookup2 = {
            $lookup: {
                from: 'recipes',
                localField: 'menu.recipe_id',
                foreignField: '_id',
                as: 'recipe_data'
            }
        };
        aggregate.push(lookup2);
        aggregate.push({$match: {'recipe_data.name': new RegExp(filter.recipe_name, 'i')}});
    }

    if (filter.order_status){
        query.$and.push({order_status: filter.order_status});
    }

    if (filter.order_date){
        query.$and.push({order_date: filter.order_date});
    }

    if (query.$and.length > 0){
        aggregate.push({$match: query});
    }

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
        const transactions = await transactionModel.aggregate(aggregate);
        const total = transactions.length;
        if(transactions.length == 0){
            throw error;
        }
        return {
            listTransaction: transactions,
            total
        };
    } catch (error) {
        throw new GraphQLError('Transaction Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
}

const getOneTransaction = async (parent, {id}, context) => {
    let aggregate = [];
    let query = {$and: []};

    query.$and.push({transaction_status : 'ACTIVE'});
    query.$and.push({_id: mongoose.Types.ObjectId(id)});
    aggregate.push({$match: query});

    try {
        const transaction = await transactionModel.aggregate(aggregate);
        if(transaction.length == 0){
            throw new GraphQLError('Transaction Tidak Ditemukan', {
                extensions: {
                    code: 404,
                }
            });
        }
        if(transaction.transaction_status == 'DELETED'){
            throw new GraphQLError('Transaction Tidak Ditemukan', {
                extensions: {
                    code: 404,
                }
            });
        }
        return transaction[0];
    } catch (error) {
        throw new GraphQLError('Transaction Tidak Ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
}


const getTransactionUsersLoader = async (parent, ags, context) => {
    if (parent.user_id) {
        return await context.TransactionUserLoader.load(parent.user_id);
    }
}

const getRecipeLoader = async (parent, ags, context) => {
    if (parent.recipe_id){
        return await context.RecipeLoader.load(parent.recipe_id);
    }
}

module.exports = {
    Query : {
        getAllTransactions,
        getOneTransaction,
    },
    Mutation: {
        createTransaction,
        deleteTransaction,
    },
    Transaction :{
        user_id: getTransactionUsersLoader
    },
    Menu: {
        recipe_id : getRecipeLoader
    }
}