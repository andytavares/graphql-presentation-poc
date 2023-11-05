import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { readFileSync } from 'node:fs';
import { startStandaloneServer } from '@apollo/server/standalone';

import data from './review.data.js';

const typeDefs = gql(
  readFileSync('./packages/services/reviews-graph/review.graphqls', {
    encoding: 'utf8',
  })
);

const resolvers = {
  Query: {
    reviews: () => data,
  },
  Review: {
    __resolveReference(ref) {
      return data.find((review) => review.id === parseInt(ref.id));
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4003 } });

console.log(`Server running at: ${url}`);
