const jwt = require('jsonwebtoken');
const UserModel = require('../user/user.model');

const userAuth = async function (resolver, parent, ags, context){
    const token = context.req.get('Authorization');
    if(!token){
        throw new Error('Token is required');
    }
    try{
        const user = await jwt.verify(token, 'secretbanget');
        context.user_id = user.id;
        context.role = user.role;
        context.token = token;
        return resolver();
    }catch(err){
        throw new Error('Invalid token');
    }
}


module.exports = {
    Query: {
        getAllUsers: userAuth,
        getOneUser: userAuth,
        getAllIngredients: userAuth,
        getOneIngredient: userAuth,
        getAllRecipes: userAuth,
        getOneRecipe: userAuth,
        getAllTransactions: userAuth,
        getOneTransaction: userAuth,
        getAllCarts: userAuth,
        getOneCart: userAuth,
    },
    Mutation: {
        updateUser: userAuth,
        deleteUser: userAuth,
        createIngredient: userAuth,
        updateIngredient: userAuth,
        deleteIngredient: userAuth,
        createRecipe: userAuth,
        updateRecipe: userAuth,
        deleteRecipe: userAuth,
        updateRecipeStatus: userAuth,
        createTransaction: userAuth,
        deleteTransaction: userAuth,
        createCart: userAuth,
        updateCart: userAuth,
        deleteCart: userAuth,
    }
};