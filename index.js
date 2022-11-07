const express = require('express');
const {merge} = require('lodash');
const {ApolloServer, gql} = require('apollo-server-express');
const {applyMiddleware} = require('graphql-middleware');
const {makeExecutableSchema} = require('graphql-tools');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

const mongodb = 'mongodb://localhost:27017/zettacamp';

mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});

const userAuthen = require('./middleware/auth');

const playlistLoader = require('./playlist/playlist.loader');

const {
  userTypeDefs,
  userResolver,
} = require('./user/user.index');

const {
  songTypeDefs,
  songResolver,
} = require('./song/song.index');

const {
  playlistTypeDefs,
  playlistResolver,
} = require('./playlist/playlist.index');

const typeDef = gql`
  type Query,
  type Mutation
`;

const typeDefs = [
  typeDef,
  userTypeDefs,
  songTypeDefs,
  playlistTypeDefs,
];

let resolvers = {};
resolvers = merge(
  resolvers,
  userResolver,
  songResolver,
  playlistResolver,
);

let authMiddleware = {};
authMiddleware = merge(
    userAuthen
);

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
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
        playlistLoader,
        req
    };
}
});

server.start().then(res => {
  server.applyMiddleware({
      app
  });
  // run port 
  app.listen(port, () => {
      console.log(`App running in port ${port}`);
  });
});
