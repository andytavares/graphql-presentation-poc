import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { gql } from 'graphql-tag';
import { readFileSync } from 'node:fs';
import { startStandaloneServer } from '@apollo/server/standalone';

import data from './product.data.js';
import reviewData from '../reviews-graph/review.data.js';

const typeDefs = gql(
  readFileSync('./packages/services/products-graph/product.graphqls', {
    encoding: 'utf8',
  })
);

const resolvers = {
  Query: {
    products: () => data,
  },
  Product: {
    reviews(product) {
      return product.reviews.map((review) => ({
        __typename: 'Review',
        id: review.id,
      }));
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });

console.log(`Server running at: ${url}`);
