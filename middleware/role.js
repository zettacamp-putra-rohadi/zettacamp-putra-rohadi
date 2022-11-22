const {GraphQLError} = require('graphql');

const verifRole = async function (resolver, parent, ags, context){
    if(context.role !== 'ADMIN'){
        throw new GraphQLError('Anda Bukan Admin!', {
            extensions: {
                code: 403,
            }
        });
    }
    return resolver();
}

module.exports = {
    Query: {
        getAllUsers: verifRole,
        // getOneUser,
        getAllIngredients: verifRole,
        getOneIngredient: verifRole,
        // getAllRecipes,
        // getOneRecipes,
        // getAllTransactions,
        // getOneTransaction,
        // getAllCarts,
        // getOneCart,
    },
    Mutation: {
        // updateUser,
        deleteUser: verifRole,
        createIngredient: verifRole,
        updateIngredient: verifRole,
        deleteIngredient: verifRole,
        createRecipe: verifRole,
        updateRecipe: verifRole,
        deleteRecipe: verifRole,
        updateRecipeStatus: verifRole,
        // createTransaction,
        deleteTransaction: verifRole,
        // createCart,
        // updateCart,
        // deleteCart,
    }
};