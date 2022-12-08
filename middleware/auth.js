const jwt = require('jsonwebtoken');
const {GraphQLError} = require('graphql');
const UserModel = require('../user/user.model');

const userAuth = async function (resolver, parent, ags, context){
    const token = context.req.get('Authorization');
    if(!token){
        throw new GraphQLError('You are not logged in', {
            extensions: {
                code: "auth/not-logged-in",
            }
        });
    }
    try{
        const user = await jwt.verify(token, 'secretbanget');
        context.user_id = user.id;
        context.role = user.role;
        context.token = token;
        return resolver();
    }catch(err){
        throw new GraphQLError('Wrong token', {
            extensions: {
                code: "auth/wrong-token",
            }
        });
    }
}

const publicAuth = async function (resolver, parent, ags, context){
    const token = context.req.get('Authorization');
    if(!token){
        context.user_id = null;
        context.role = 'PUBLIC';
    } else {
        const user = await jwt.verify(token, 'secretbanget');
        context.user_id = user.id;
        context.role = user.role;
        context.token = token;
    }
    return resolver();
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
        getAllFavorites : userAuth,
        getOneFavorite : userAuth,
        getAllRatings : publicAuth,
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
        updateOfferStatus: userAuth,
        updateDiscountStatus: userAuth,
        createTransaction: userAuth,
        deleteTransaction: userAuth,
        createCart: userAuth,
        updateCart: userAuth,
        deleteCart: userAuth,
        createFavorite: userAuth,
        deleteFavorite: userAuth,
        createRating: userAuth,
    }
};