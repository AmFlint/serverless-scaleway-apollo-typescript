import { ApolloServer } from 'apollo-server';

import { typeDefs } from './typedefs';
import { resolvers } from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: process.env.PORT || 8080 }).then(() => console.log('Server listening'));
