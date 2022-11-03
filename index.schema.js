const { gql } = require('apollo-server-express');

const typeDefs = gql`
scalar Date

    type BookPurchasing {
        bookName : String
        discount : Int
        tax : Int
        bookStock : Int
        bookPurchase : Int
        terms : Int
        addtionalTems : Float
    }

    type Credit {
        Book_Name : String
        Month : Int
        Credit_To_Be_Paid : Float
        Credit_Already_Paid : Float
        Remaining : Float
    }

    type Book {
        _id : ID
        name: String
        author: String
        date_published: Date
        price: Float
    }

    type Total {
        total : Int
    }

    type BookPerPage {
        book: [Book]
        totalBook : [Total]
    }

    type Query {
        getBooks: [Book],
        getOneBook(_id: ID): Book
        getBooksPerPage(page: Int, limit: Int, sort:Float): [BookPerPage]
    }

    type Mutation {
        createBook(name: String, author: String, date_published: String, price: Float): Book,
        updateBook(_id: ID, name: String, author: String, date_published: String, price: Float): Book,
        deleteBook(_id: ID): Book,
        calcualteBookPurchasing(bookName: String, discount: Int, tax: Int, bookStock: Int, bookPurchase: Int, terms: Int, addtionalTems: Float): [Credit]
    }
`;

module.exports = typeDefs;