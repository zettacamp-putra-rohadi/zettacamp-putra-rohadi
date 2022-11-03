const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bookModel = require('./model');
const bookshelfModel = require('./bookshelf-model');
const { ApolloServer, gql } = require('apollo-server-express');

const port = 4000
const app = express()

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/zettacamp');

const typeDefs = gql`
    type data {
        bookName : String
        discount : Int
        tax : Int
        bookStock : Int
        bookPurchase : Int
        terms : Int
        addtionalTems : Float
    }

    type Book {
        name: String
        author: String
        date_published: String
        price: Float
    }

    type Query {
        bookPurchasing: [data]
        books: [Book]
    }
`;

const datas = [
    {
        bookName : "The Lord of the Rings",
        discount : 10,
        tax : 11,
        bookStock : 100,
        bookPurchase : 10,
        terms : 5,
        addtionalTems : 128.8
    }
];

async function getBooks() {
    const books = await bookModel.find({});
    try {
        return books;
    } catch (err) {
        return err;
    }
};

const resolvers = {
    Query: {
        bookPurchasing: () => datas,
        books: () => getBooks(),
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.start().then(res => {
    server.applyMiddleware({
        app
    });
    app.listen(port, () => {
        console.log(`App running in port ${port}`);
    });
});
