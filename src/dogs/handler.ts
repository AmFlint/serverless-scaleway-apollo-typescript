import { ApolloServer, gql } from 'apollo-server-lambda';
import { resolvers } from './resolvers';

const typeDefs = gql`
  type Dog {
    id: Int!
    name: String!
    owner: Owner!
  }

  type Owner {
    id: Int!
    firstname: String!
    lastname: String!
    dogs: [Dog]!
  }

  type Query {
    dogs: [Dog]!
    dog: Dog!
    owners: [Owner]!
    owner: Owner!
  }

  type Mutation {
    createDog(
      name: String!
      ownerId: Int!
    ): Dog
    deleteDog(
      id: Int!
    ): Dog
  }
`;

const server = new ApolloServer({ typeDefs, resolvers });
exports.handler = server.createHandler();
