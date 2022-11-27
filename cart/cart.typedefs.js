const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Cart {
        _id : ID
        user_id : ID
        recipe_id : Recipe
        amount : Int
        note : String
        cart_status : cartStatus
    }

    enum cartStatus{
        ACTIVE
        DELETED
    }

    type Carts {
        listCart : [Cart]
        total : Int
        totalPrice : Float
    }

    input MenuInput {
        recipe_id : ID!
        amount : Int!
        note : String
    }

    type CreateReturn{
        status : String
    }

    type Query {
        getAllCarts(page: Int!, limit: Int!) : Carts,
        getOneCart(id : ID!) : Cart
    }

    type Mutation {
        createCart(menu : MenuInput) : CreateReturn,
        updateCart(menu : MenuInput) : Cart,
        deleteCart(_id : ID!) : Cart
    }
`;

module.exports = typeDefs;