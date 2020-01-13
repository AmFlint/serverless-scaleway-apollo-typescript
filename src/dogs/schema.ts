import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull } from 'graphql';
import { listDogs, getDog, getOwner, getDogsForOwner, listOwners, createDog, deleteDog } from './db';

const DogType = new GraphQLObjectType({
  name: 'Dog',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    owner: {
      type: OwnerType,
      async resolve({ owner_id }) {
        return await getOwner(owner_id);
      }
    }
  })
});

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: { type: GraphQLInt },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    dogs: {
      type: new GraphQLList(DogType),
      async resolve({ id }) {
        try {
          return await getDogsForOwner(id);
        } catch (err) {
          console.error(err);
          throw new Error('Something went wrong')
        }
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    dogs: {
      type: new GraphQLList(DogType),
      async resolve(parent, args) {
        return await listDogs();
      }
    },
    dog: {
      type: DogType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      async resolve(source, { id }) {
        return await getDog(id);
      }
    },
    owners: {
      type: new GraphQLList(OwnerType),
      async resolve() {
        return await listOwners();
      }
    },
    owner: {
      type: OwnerType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      async resolve(source, { id }) {
        return await getOwner(id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createDog: {
      type: DogType,
      description: 'Create a dog and assign it to an owner',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Name for the dog to create'
        },
        ownerId: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'ID of the owner of the dog'
        }
      },
      async resolve(source, { name, ownerId }, ctx) {
        // get Owner
        let owner;
        try {
          owner = await getOwner(ownerId);
        } catch (err) {
          console.error(err);
          throw new Error('Something went wrong');
        }
        if (!owner) {
          throw new Error('Owner does not exist');
        }
        try {
          const newDog = await createDog(name, ownerId)
          return newDog;
        } catch (err) {
          console.error(err);
          throw new Error('Something went wrong');
        }
      }
    },
    deleteDog: {
      type: DogType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'ID of the dog to delete'
        }
      },
      async resolve(source, { id }) {
        let dog;
        try {
          dog = await getDog(id);
        } catch(err) {
          console.error(err);
          throw new Error('Something went wrong');
        }
        if (!dog) {
          throw new Error('Dog does not exist');
        }
        try {
          await deleteDog(dog.id);
        } catch(error) {
          console.error(error);
          throw new Error('Something went wrong');
        }
        return dog;
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
