const jwt = require('jsonwebtoken');
const UserModel = require('../user/user.model');

const userAuth = async function (resolver, parent, ags, context){
    const token = context.req.get('Authorization');
    if(!token){
        throw new Error('Token is required');
    }
    try{
        const user = await jwt.verify(token, 'secretbanget');
        const getUser = await UserModel.aggregate([
                            { $match :{email: user.email} },
                            { $project : {hashed_password: 0} }
                        ]);
        context.user = getUser;
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
        getAllTransactions: userAuth,
        getOneTransaction: userAuth,
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
    }
};