const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bookModel = require('./model');
const bookshelfModel = require('./bookshelf-model');
const { ApolloServer } = require('apollo-server-express');
// const typeDefs = require('./index.schema');
// const resolvers = require('./index.resolvers');
const typeDefs = require('./bookshelf.schema');
const resolvers = require('./bookshelf.resolvers');


const port = 4000
const app = express()

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/zettacamp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: function ({
        req
    }) {
        req: req;
        return {
            
            req
        };
    }
});

server.start().then(res => {
    server.applyMiddleware({
        app
    });
    app.listen(port, () => {
        console.log(`App running in port ${port}`);
    });
});