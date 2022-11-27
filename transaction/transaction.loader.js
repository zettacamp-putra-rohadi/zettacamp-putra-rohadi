const DataLoader = require('dataloader');
const UserModel = require('../user/user.model');
const RecipeModel = require('../recipe/recipe.model');

const loadTransactionUser = async (userIds) => {
    // const userList = await UserModel.find({_id: {$in: userIds}});
    const userMap = {};
    const users = await UserModel.aggregate([
        { $match: { _id: { $in: userIds } } },
        { $project: { hashed_password:0 } }
    ]);
    
    users.forEach((user) => {
        userMap[user._id] = user;
    });
    
    return userIds.map(id => userMap[id]);
}

const TransactionUserLoader = new DataLoader(loadTransactionUser);

const loadRecipe = async (recipeIds) => {
    const recipeList = await RecipeModel.find({_id: {$in: recipeIds}});
    const recipeMap = {};

    recipeList.forEach((recipe) => {
        recipeMap[recipe._id] = recipe;
    });

    return recipeIds.map(id => recipeMap[id]);
}

const RecipeLoader = new DataLoader(loadRecipe);

module.exports = {
    TransactionUserLoader,
    RecipeLoader
}