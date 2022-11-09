const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Users{
        _id : ID!
        first_name : String!
        last_name : String!
        email : String!
        hashed_password : String!
        user_status : UserStatus
    }

    enum UserStatus{
        ACTIVE
        DELETED
    }

    type UsersResult{
        _id : ID
        first_name : String
        last_name : String
        email : String
    }

    type UsersResultGetAll{
        users : [UsersResult!]
        total : Int
    }

    input UsersFilter{
        first_name : String
        last_name : String
        email : String
        page : Int!
        limit : Int!
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
    
    input UpdateUserInput{
        first_name : String
        last_name : String
        email : String
        password : String
    }

    input UserLoginInput{
        email : String!
        password : String!
    }

    type Query{
        getAllUsers(user_input : UsersFilter) : UsersResultGetAll
        getOneUser(_id : ID, email: String) : UsersResult
    }

    type Mutation{
        createUser(user_input : UsersInput) : UsersResult
        loginUser(user_input : UserLoginInput) : LoginUserResult
        updateUser(_id : ID!, user_input : UpdateUserInput) : UsersResult
        deleteUser(_id : ID!) : UsersResult
    }

`;

module.exports = typeDefs;