const {ApollowServe, gql} = require('apollo-server-express');

const typeDefs = gql`
scalar Date
    type Transaction{
        _id: ID
        user_id: Users
        menu: [Menu]
        total_price: Float
        order_status: OrderStatus
        order_date: String
        transaction_status: TransactionStatus
        rating_status: Boolean
        decline_recipe: [DeclineRecipe]
        is_stock: Boolean
        is_balance: Boolean
    }

    type Menu{
        recipe_id: Recipe
        amount: Int
        note: String
        name: String
        picture: String
        price: Float
        discount: Float
        price_after_discount: Float
        discount_status: DiscountStatus
    }

    enum OrderStatus{
        SUCCESS
        FAILED
    }

    enum TransactionStatus{
        ACTIVE
        DELETED
    }

    enum DiscountStatus{
        ACTIVE
        DELETED
    }

    input TransactionInput{
        last_name_user: String
        recipe_name: String
        order_status: OrderStatus
        order_date: String
        page: Int!
        limit: Int!
    }

    type TransactionResult{
        listTransaction: [Transaction]
        total: Int
    }

    input MenuInput{
        recipe_id: ID!
        amount: Int!
        note: String
        name: String!
        picture: String!
        price: Float!
        discount: Float!
        price_after_discount: Float!
        discount_status: DiscountStatus!
    }
    
    type CreateTransaction{
        _id: ID
        user_id: Users
        menu: [Menu]
        total_price: Float
        order_status: OrderStatus
        order_date: String
        transaction_status: TransactionStatus
        decline_recipe: [DeclineRecipe]
        is_stock: Boolean
        is_balance: Boolean
    }

    type DeclineRecipe{
        isStock: Boolean
        recipe_id: ID
        recipe_name: String
    }

    type Query{
        getAllTransactions(filter: TransactionInput): TransactionResult
        getOneTransaction(id: ID!): Transaction
    }

    type Mutation{
        createTransaction(menu_input: [MenuInput], totalPrice : Float!): CreateTransaction
        deleteTransaction(id: ID!): Transaction
    }
`;

module.exports = typeDefs;