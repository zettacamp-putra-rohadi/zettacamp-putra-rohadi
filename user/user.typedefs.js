const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Users{
        _id : ID!
        first_name : String!
        last_name : String!
        email : String!
        hashed_password : String!
        user_status : UserStatus
        user_type : UserType
    }

    enum UserStatus{
        ACTIVE
        DELETED
    }

    type UserType{
        user_type_name : String!
        user_type_permission : [UserTypePermission]
    }

    type UserTypePermission{
        name : String!
        view : Boolean!
    }

    type UsersResult{
        _id : ID
        first_name : String
        last_name : String
        email : String
        user_status : UserStatus
        user_type : UserType
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
        user_type : InputUserType
    }

    input InputUserType{
        user_type_name : String!
        user_type_permission : [InputUserTypePermission]
    }

    input InputUserTypePermission{
        name : String!
        view : Boolean!
    }
    
    input UpdateUserInput{
        first_name : String
        last_name : String
        email : String
        password : String
        user_type : InputUserType
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