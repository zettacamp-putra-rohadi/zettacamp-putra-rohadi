const {ApollowServe, gql} = require('apollo-server-express');

const typeDefs = gql`
scalar Date
    type Transaction{
        _id: ID
        user_id: Users
        menu: [Menu]
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
        recipe_id: ID
        amount: Int
        note: String
    }

    type Query{
        getAllTransactions(filter: TransactionInput): TransactionResult
        getOneTransaction(id: ID!): Transaction
    }

    type Mutation{
        createTransaction(menu_input: [MenuInput]): Transaction
        deleteTransaction(id: ID!): Transaction
    }
`;

module.exports = typeDefs;