const transactionModel = require('./transaction.model');
const recipeModel = require('../recipe/recipe.model');
const ingredientModel = require('../ingredient/ingredient.model');
const mongoose = require('mongoose');

const createTransaction = async (parent, {menu_input}, context) => {
    const userId = context.user._id;
    try {
        const isStock = await validateStockIngredient(menu_input);
        if (isStock) {
            console.log('stock cukup');
            const newTransaction = new transactionModel({
                user_id : userId,
                menu: menu_input,
                order_status: 'SUCCESS',
                order_date: Date.now(),
                transaction_status: 'ACTIVE'
            });
            const result = await newTransaction.save();
            return result;
        } else {
            console.log('stock tidak cukup');
            const newTransaction = new transactionModel({
                user_id : userId,
                menu : menu_input,
                order_status: 'FAILED',
                order_date: Date.now(),
                transaction_status: 'ACTIVE'
            });
            await newTransaction.save();
            throw new Error("Stok tidak mencukupi");
        }
    } catch (error) {
        throw error;
    }
}

// async function testtest() {
//     const result = await validateStockIngredient([
//         {recipe_id: "636db322d912580e84cc209f", amount: 20},
//         {recipe_id: "636db322d912580e84cc209f", amount: 0}
//     ]);
//     console.log(result);
// }

// testtest();

async function validateStockIngredient(recipe_input) {
    let ingredientsUsed = [];
    let isStock = true;
    for (let a = 0; a < recipe_input.length; a++) {
        const recipe = await recipeModel.findById(recipe_input[a].recipe_id);
        for (let i = 0; i < recipe.ingredients.length; i++) {
            const ingredient = await ingredientModel.findById(recipe.ingredients[i].ingredient_id);
            if (ingredient.stock < (recipe.ingredients[i].stock_used * recipe_input[a].amount)) {
                isStock = false;
                return isStock;
            } else {
                ingredientsUsed.push({
                    ingredient_id: recipe.ingredients[i].ingredient_id,
                    amount: recipe.ingredients[i].stock_used * recipe_input[a].amount
                });
            }
        }
        if (isStock) {
            const result = reduceingredientStock(ingredientsUsed);
            isStock = result;
            ingredientsUsed = [];
        }
    }
    return isStock;
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
        throw new Error('transaction tidak ditemukan');
    }
    if(transaction.transaction_status === 'DELETED'){
        throw new Error('transaction telah dihapus');
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

    aggregate.push({$skip: filter.page * filter.limit});
    aggregate.push({$limit: filter.limit});

    try {
        const transactions = await transactionModel.aggregate(aggregate);
        const total = transactions.length;
        if(transactions.length == 0){
            throw new Error('Transaction tidak ditemukan');
        }
        return {
            listTransaction: transactions,
            total
        };
    } catch (error) {
        throw new Error(error);
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
        if(!transaction){
            throw new Error('Transaction tidak ditemukan');
        }
        if(transaction.transaction_status == 'DELETED'){
            throw new Error('Transaction telah dihapus');
        }
        return transaction[0];
    } catch (error) {
        throw new Error(error);
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