const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Users{
        _id : ID!
        first_name : String!
        last_name : String!
        email : String!
        hashed_password : String
        user_status : UserStatus
        role : RoleUser
        first_answer : String
        second_answer : String
        balance : Float
        user_type : UserType
    }

    enum UserStatus{
        ACTIVE
        DELETED
    }

    enum RoleUser{
        ADMIN
        USER
    }

    type UserType{
        name: String
        view: Boolean
    }

    type UsersResult{
        _id : ID
        first_name : String
        last_name : String
        email : String
        user_status : UserStatus
        role : RoleUser
        user_question : String
        user_answer : String
        balance : Float
        user_type : [UserType]
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
        user : UsersResult
        token : String!
    }

    input UsersInput{
        first_name : String!
        last_name : String!
        email : String!
        password : String!
        role : RoleUser!
        user_question : String
        user_answer : String
    }

    input ForgotPasswordUsersInput{
        email : String!
        password : String!
        user_answer : String!
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
        forgotPassword(user_input : ForgotPasswordUsersInput) : UsersResult
        updateUser(_id : ID!, user_input : UpdateUserInput) : UsersResult
        deleteUser(_id : ID!) : UsersResult
    }

`;

module.exports = typeDefs;