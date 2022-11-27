const DataLoader = require('dataloader');
const ingredientModel = require('../ingredient/ingredient.model');

const loadIngredients = async (ingredientIds) => {
    const ingredientList = await ingredientModel.find({_id: {$in: ingredientIds}});
    const ingredientMap = {};
    
    ingredientList.forEach((ingredient) => {
        ingredientMap[ingredient._id] = ingredient;
    });
    
    return ingredientIds.map(id => ingredientMap[id]);
    // return ingredientIds.map(ingredientId => ingredients.find(ingredient => ingredient._id.toString() === ingredientId.toString()));
}

const ingredientLoader = new DataLoader(loadIngredients);
module.exports = ingredientLoader;