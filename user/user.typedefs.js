const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Users{
        _id : ID!
        first_name : String!
        last_name : String!
        email : String!
        hashed_password : String!
        status : String!
    }

    type UsersResult{
        _id : ID!
        first_name : String!
        last_name : String!
        email : String!
        status : String!
    }

    input UsersFilter{
        first_name : String
        last_name : String
        email : String
    }

    type LoginUserResult{
        email : String!
        token : String!
    }

    input UsersInput{
        first_name : String!
        last_name : String!
        email : String!
        password : String!
    }

    input UserLoginInput{
        email : String!
        password : String!
    }

    type Query{
        getAllUsers(user_input : UsersFilter) : [UsersResult]
    }

    type Mutation{
        createUser(user_input : UsersInput) : UsersResult
        loginUser(user_input : UserLoginInput) : LoginUserResult
    }

`;

module.exports = typeDefs;