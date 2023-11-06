import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { readFileSync } from 'node:fs';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloClient, InMemoryCache } from '@apollo/client/core/core.cjs';

const createClient = (clientUrl) => {
  return new ApolloClient({
    uri: clientUrl,
    cache: new InMemoryCache(),
  });
};

const typeDefs = gql(
  readFileSync(
    './packages/acl-monorepo/packages/inventory-external/inventory.graphqls',
    {
      encoding: 'utf8',
    }
  )
);

const inventoryClient = createClient('http://localhost:4004');
const s2sClient = createClient('http://localhost:4000');

const resolvers = {
  Query: {
    products: async () => {
      const res = await s2sClient.query({
        query: gql`
          query getProducts {
            products {
              id
            }
          }
        `,
      });
      return res.data.products;
    },
    inventory: async () => {
      const res = await inventoryClient.query({
        query: gql`
          query getInventory {
            inventory {
              id
              stock
            }
          }
        `,
      });
      return res.data.inventory;
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4005 } });

console.log(`Server running at: ${url}`);
