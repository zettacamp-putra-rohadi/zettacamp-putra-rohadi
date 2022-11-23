const {ApollowServe, gql} = require('apollo-server-express');

const typeDefs = gql`
scalar Date
    type Transaction{
        _id: ID
        user_id: Users
        menu: [Menu]
        total_price: Float
        order_status: OrderStatus
        order_date: Date
        transaction_status: TransactionStatus
    }

    type Menu{
        recipe_id: Recipe
        amount: Int
        note: String
    }

    enum OrderStatus{
        SUCCESS
        FAILED
    }

    enum TransactionStatus{
        ACTIVE
        DELETED
    }

    input TransactionInput{
        last_name_user: String
        recipe_name: String
        order_status: OrderStatus
        order_date: Date
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
    }
    
    type CreateTransaction{
        _id: ID
        user_id: Users
        menu: [Menu]
        total_price: Float
        order_status: OrderStatus
        order_date: Date
        transaction_status: TransactionStatus
        DeclineRecipe: [DeclineRecipe]
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