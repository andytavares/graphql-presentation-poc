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
  Product: {
    reviews(product) {
      return data.filter(
        (review) => review.product.id.toString() === product.id
      );
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4003 } });

console.log(`Server running at: ${url}`);
