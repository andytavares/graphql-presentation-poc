import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { readFileSync } from 'node:fs';
import { startStandaloneServer } from '@apollo/server/standalone';
import fetch from 'node-fetch';

const typeDefs = gql(
  readFileSync('./packages/services/inventory-service/inventory.graphqls', {
    encoding: 'utf8',
  })
);

const resolvers = {
  Query: {
    inventory: async () => {
      const res = await fetch('http://localhost:3000/inventory/');
      const json = await res.json();
      return json;
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4004 } });

console.log(`Server running at: ${url}`);
