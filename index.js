const express = require("express");
const { merge } = require("lodash");
const { ApolloServer, gql } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("graphql-tools");
const mongoose = require("mongoose");

const app = express();
const port = 4000;

const mongodb = "mongodb://localhost:27017/mini_project_putra";
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

const userAuthen = require("./middleware/auth");

const { userTypedefs, userResolver } = require("./user/user.index");
const { ingredientTypeDefs, ingredientResolver } = require("./ingredient/ingredient.index");
const { recipeTypeDefs, recipeResolver } = require("./recipe/recipe.index");

const ingredientListLoader = require("./recipe/recipe.loader");

const typeDef = gql`
  type Query,
  type Mutation
`;

const typeDefs = [
    typeDef,
    userTypedefs,
    ingredientTypeDefs,
    recipeTypeDefs,
];

let resolvers = {};
resolvers = merge(
    resolvers,
    userResolver,
    ingredientResolver,
    recipeResolver,
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
