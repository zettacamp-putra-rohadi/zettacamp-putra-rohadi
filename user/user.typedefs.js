const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Users{
        _id: ID
        name: String
        email: String
        hashed_password: String
    }

    type UsersResult{
        _id: ID
        name: String
        email: String
    }

    type AllUsers{
        users: [UsersResult]
        count: Int
    }

    input UsersInput{
        name: String
        email: String
        password: String
    }

    input UserSearchInput{
        user_id: ID
    }

    type LoginUser{
        id: ID
        email: String
        token: String
    }
    input LoginUserInput{
        email: String!
        password: String!
    }
    
    extend type Mutation{
        loginUser(user_input: LoginUserInput): LoginUser
        insertUser(user_input: UsersInput) : Users
    }
    
    extend type Query{
        getAllUsers(page: Int, limit: Int): AllUsers
        getUserById(user_input: UserSearchInput) : Users
    }
    `;
    
    module.exports = typeDefs;
    // editUser(id: ID, user_input: UsersInput) : Users