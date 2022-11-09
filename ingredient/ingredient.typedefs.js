const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Ingredient {
        _id : ID
        name : String
        stock : Int
        ingredient_status : ingredientStatus
    }

    enum ingredientStatus{
        ACTIVE
        DELETED
    }

    input IngredientFilter{
        name : String
        stock : Int
        page : Int!
        limit : Int!
    }

    type IngredientResult{
        listIngredient : [Ingredient]
        total : Int
    }

    type Query{
        getAllIngredients(filter : IngredientFilter) : IngredientResult
        getOneIngredient(_id : ID!) : Ingredient
    }

    type Mutation{
        createIngredient(name : String!, stock : Int!) : Ingredient
        updateIngredient(_id : ID!, stock : Int) : Ingredient
        deleteIngredient(_id : ID!) : Ingredient
    }
`;

module.exports = typeDefs;