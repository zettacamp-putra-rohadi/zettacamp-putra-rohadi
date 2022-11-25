const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Favorite {
        _id : ID
        user_id : ID
        recipe_id : ID
        favorite_status : favoriteStatus
    }

    enum favoriteStatus{
        ACTIVE
        DELETED
    }

    type FavoriteResult{
        listFavorite : [Favorite]
        total : Int
    }

    type Query{
        getAllFavorites(page: Int!, limit: Int! ) : FavoriteResult
        getOneFavorite(_id : ID!) : Favorite
    }

    type Mutation{
        createFavorite(recipe_id : ID!) : Favorite
        deleteFavorite(_id : ID!) : Favorite
    }
`;

module.exports = typeDefs;