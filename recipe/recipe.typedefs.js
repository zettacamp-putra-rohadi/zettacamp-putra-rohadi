const {ApollowServe, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Recipe {
        _id: ID
        name: String
        ingredients: [ListIngredient]
        recipe_status: recipeStatus
    }

    type RecipesResult{
        listRecipe: [Recipe]
        total: Int
    }

    type ListIngredient {
        ingredient_id: Ingredient
        stock_used: Int
    }

    input filterRecipe {
        recipe_name: String
        page: Int
        limit: Int
    }

    input IngredientInput {
        ingredient_id: ID
        stock_used: Int
    }

    enum recipeStatus {
        ACTIVE
        DELETED
    }

    type Query {
        getAllRecipes(filter: filterRecipe): RecipesResult
        getOneRecipe(_id: ID): Recipe
    }

    type Mutation {
        createRecipe(name: String!, ingredients: [IngredientInput]): Recipe
        updateRecipe(_id: ID!, name: String, ingredients: [IngredientInput]): Recipe
        deleteRecipe(_id: ID!): Recipe
    }
`;
module.exports = typeDefs;