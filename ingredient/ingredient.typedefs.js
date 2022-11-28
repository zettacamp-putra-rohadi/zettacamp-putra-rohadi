const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Ingredient {
        _id : ID
        name : String
        stock : Float
        unit : String
        ingredient_status : ingredientStatus
        list_recipe : [String]
    }

    enum ingredientStatus{
        ACTIVE
        DELETED
    }

    input IngredientFilter{
        name : String
        stock : Float
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
        createIngredient(name : String!, stock : Float!, unit : String!) : Ingredient
        updateIngredient(_id : ID!, stock : Int!, unit : String!) : Ingredient
        deleteIngredient(_id : ID!) : Ingredient
    }
`;

module.exports = typeDefs;