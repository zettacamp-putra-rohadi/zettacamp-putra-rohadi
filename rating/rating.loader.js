const DataLoader = require('dataloader');
const recipeModel = require('../recipe/recipe.model');
const userModel = require('../user/user.model');

const loadRecipes = async (recipeIds) => {
    const recipeList = await recipeModel.find({_id: {$in: recipeIds}});
    const recipeMap = {};

    recipeList.forEach((recipe) =>{
        recipeMap[recipe._id] = recipe;
    });

    return recipeIds.map(id => recipeMap[id]);
}

const loadUser = async (userIds) => {
    const userMap = {};
    const users = await userModel.aggregate([
        { $match: { _id: { $in: userIds } } },
        { $project: { hashed_password:0 } }
    ]);
    
    users.forEach((user) => {
        userMap[user._id] = user;
    });
    
    return userIds.map(id => userMap[id]);
}

const ratingRecipeLoader = new DataLoader(loadRecipes);
const ratingUserLoader = new DataLoader(loadUser);

module.exports = {
    ratingRecipeLoader,
    ratingUserLoader
};