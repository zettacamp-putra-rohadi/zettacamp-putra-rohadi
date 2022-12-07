const express = require("express");
const { merge } = require("lodash");
const { ApolloServer, gql } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("graphql-tools");
const mongoose = require("mongoose");
const db = require("./db");

const app = express();
const port = 4000;

const mongodb = db;
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

const userAuthen = require("./middleware/auth");
const verifRole = require("./middleware/role");

const { userTypedefs, userResolver } = require("./user/user.index");
const { ingredientTypeDefs, ingredientResolver } = require("./ingredient/ingredient.index");
const { recipeTypeDefs, recipeResolver } = require("./recipe/recipe.index");
const { transactionTypeDefs, transactionResolver } = require("./transaction/transaction.index");
const { cartTypeDefs, cartResolver } = require("./cart/cart.index");
const { favoriteTypeDefs, favoriteResolver } = require("./favorite/favorite.index");
const { ratingTypeDefs, ratingResolver } = require("./rating/rating.index.js");

const ingredientListLoader = require("./recipe/recipe.loader");
const {TransactionUserLoader, RecipeLoader} = require("./transaction/transaction.loader");
const favoriteRecipeLoader = require("./favorite/favorite.loader");
const ratingRecipeLoader = require("./rating/rating.loader");

const typeDef = gql`
  type Query,
  type Mutation
`;

const typeDefs = [
    typeDef,
    userTypedefs,
    ingredientTypeDefs,
    recipeTypeDefs,
    transactionTypeDefs,
    cartTypeDefs,
    favoriteTypeDefs,
    ratingTypeDefs
];

let resolvers = {};
resolvers = merge(
    resolvers,
    userResolver,
    ingredientResolver,
    recipeResolver,
    transactionResolver,
    cartResolver,
    favoriteResolver,
    ratingResolver
    );

let authMiddleware = {};
authMiddleware = merge(userAuthen);

let roleMiddleware = {};
roleMiddleware = merge(verifRole);

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const protectedSchema = applyMiddleware(executableSchema, authMiddleware, roleMiddleware);

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
          favoriteRecipeLoader,
          ratingRecipeLoader,
          req
      };
  },
});

server.start().then((res) => {
  server.applyMiddleware({
    app,
  });
  // run port
  app.listen(port, () => {
    console.log(`App running in port ${port}`);
  });
});
