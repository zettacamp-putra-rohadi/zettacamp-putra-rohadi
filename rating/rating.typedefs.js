const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Rating {
        _id: ID
        user_id : ID
        recipe_id : ID
        transaction_id : ID
        rating_value : Int
        review : String
        rating_date : String
        recipe_data : [RecipeData]
    }

    type RecipeData {
        name : String
        picture : String
    }

    type RatingResult{
        listRating : [Rating]
        total : Int
    }

    input InputRating {
        recipe_id : ID!, 
        transaction_id : ID!, 
        rating_value : Int!, 
        review : String
    }

    type Query{
        getAllRatings(page: Int!, limit: Int!, recipe_id: ID ) : RatingResult
    }
    type Mutation{
        createRating(input : [InputRating]) : [Rating]
    }
`;

module.exports = typeDefs;