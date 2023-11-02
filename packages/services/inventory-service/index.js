import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { readFileSync } from 'node:fs';
import { startStandaloneServer } from '@apollo/server/standalone';

import data from './inventory.data.js';

const typeDefs = gql(
  readFileSync('./packages/inventory-graph/inventory.graphqls', {
    encoding: 'utf8',
  })
);

const resolvers = {
  Query: {
    inventory: () => data,
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4004 } });

console.log(`Server running at: ${url}`);
