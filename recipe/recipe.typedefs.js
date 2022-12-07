const {ApollowServe, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Recipe {
        _id: ID
        name: String
        picture: String
        price: Float
        discount: Float
        price_after_discount: Float
        ingredients: [ListIngredient]
        recipe_status: recipeStatus
        discount_status: discountStatus
        is_favorite: Boolean
        favorite_id: ID
        offer_status: offerStatus
    }

    type GetRecipe {
        _id: ID
        name: String
        picture: String
        price: Float
        discount: Float
        price_after_discount: Float
        ingredients: [ListIngredient]
        recipe_status: recipeStatus
        discount_status: discountStatus
        offer_status: offerStatus
        is_favorite: Boolean
        favorite_id: ID
        availableStock : Int
        avg_rating: Float
    }

    type RecipesResult{
        listRecipe: [GetRecipe]
        total: Int
    }

    type ListIngredient {
        ingredient_id: Ingredient
        stock_used: Int
    }

    input filterRecipe {
        recipe_name: String
        recipe_status: recipeStatusInput
        page: Int!
        limit: Int!
    }

    input IngredientInput {
        ingredient_id: ID!
        stock_used: Int!
    }

    enum recipeStatus {
        ACTIVE
        UNPUBLISH
        DELETED
    }

    enum recipeStatusInput {
        ACTIVE
        UNPUBLISH
    }

    enum discountStatus {
        ACTIVE
        INACTIVE
    }

    enum offerStatus {
        ACTIVE
        INACTIVE
    }

    type Query {
        getAllRecipes(filter: filterRecipe): RecipesResult
        getAllRecipesPublic(filter: filterRecipe): RecipesResult
        getOneRecipe(_id: ID!): GetRecipe
        getTop3Recipes: [GetRecipe]
    }

    type Mutation {
        createRecipe(name: String!, picture: String!, price: Float!, discount: Float ingredients: [IngredientInput]!, discount_status: discountStatus!): Recipe
        updateRecipe(_id: ID!, name: String, picture: String, price: Float!, discount: Float, ingredients: [IngredientInput]!, discount_status: discountStatus!): Recipe
        deleteRecipe(_id: ID!): Recipe
        updateRecipeStatus(_id: ID!, recipe_status: recipeStatusInput!): Recipe
        updateOfferStatus(_id: ID!, offer_status: offerStatus!): Recipe
        updateDiscountStatus(_id: ID!, discount_status: discountStatus!): Recipe
    }
`;
module.exports = typeDefs;