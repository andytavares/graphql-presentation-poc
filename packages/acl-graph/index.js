import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'inventory', url: 'http://localhost:4004' },
      { name: 'subgraph', url: 'http://localhost:4000/graphql' },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`Server running at: ${url}`);
