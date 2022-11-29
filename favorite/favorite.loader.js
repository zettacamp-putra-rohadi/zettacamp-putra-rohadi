const DataLoader = require('dataloader');
const recipeModel = require('../recipe/recipe.model');

const loadRecipes = async (recipeIds) => {
    const recipeList = await recipeModel.find({_id: {$in: recipeIds}});
    const recipeMap = {};

    recipeList.forEach((recipe) =>{
        recipeMap[recipe._id] = recipe;
    });

    return recipeIds.map(id => recipeMap[id]);
}

const favoriteRecipeLoader = new DataLoader(loadRecipes);

module.exports = favoriteRecipeLoader;