const { gql } = require('apollo-server-express');

const typeDefs = gql`
scalar Date

    type Bookshelf{
        _id : ID
        shelf_name : String
        book_ids : [Book]
        datetime : [DateTime]
    }

    type Book{
        book_id : [BookData]
        added_date : Date
        stock : Int
    }

    type BookData{
        _id : ID
        name : String
        author : String
    }

    type DateTime{
        date : String
        time : String
    }

    type Query {
        getOneBookshelf(_id : ID): Bookshelf,
        getAllBookshelf : [Bookshelf]
    }
`;

module.exports = typeDefs;