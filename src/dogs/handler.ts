import { ApolloServer } from 'apollo-server-lambda';

import { typeDefs } from './typedefs';
import { resolvers } from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
exports.handler = server.createHandler();
