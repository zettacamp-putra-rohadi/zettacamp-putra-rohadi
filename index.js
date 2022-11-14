// populate environment variables
const dotenv = require('dotenv').config();

const express = require("express");
const { merge } = require("lodash");
const { ApolloServer, gql } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("graphql-tools");
// const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 4000;

// dont forget to enable cors wkwk
// so i can access it from frontend
const cors = require('cors');
app.use(cors());

// using mongodb atlas instead, for testing purpose wkwk
const db = require('./db');
db.connect();

// const mongodb = "mongodb://localhost:27017/mini_project_putra";
// mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

const userAuthen = require("./middleware/auth");

const { userTypedefs, userResolver } = require("./user/user.index");
const { ingredientTypeDefs, ingredientResolver } = require("./ingredient/ingredient.index");
const { recipeTypeDefs, recipeResolver } = require("./recipe/recipe.index");
const { transactionTypeDefs, transactionResolver } = require("./transaction/transaction.index");

const ingredientListLoader = require("./recipe/recipe.loader");

const {TransactionUserLoader, RecipeLoader} = require("./transaction/transaction.loader");

const typeDef = gql`
  type Query,
  type Mutation
`;

const typeDefs = [
    typeDef,
    userTypedefs,
    ingredientTypeDefs,
    recipeTypeDefs,
    transactionTypeDefs
];

let resolvers = {};
resolvers = merge(
    resolvers,
    userResolver,
    ingredientResolver,
    recipeResolver,
    transactionResolver
    );

let authMiddleware = {};
authMiddleware = merge(userAuthen);

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

const server = new ApolloServer({
  schema: protectedSchema,
  typeDefs,
  resolvers,
  context: function ({
    req
  }) {
      req: req;
      return {
          ingredientListLoader,
          TransactionUserLoader,
          RecipeLoader,
          req
      };
  },
});

server.start().then((res) => {
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`App running in port ${port}`);
  });
});