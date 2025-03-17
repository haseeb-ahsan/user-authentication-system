import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import { schema, resolvers } from './schema.js';

dotenv.config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO, {
  tls: true,
  serverSelectionTimeoutMS: 3000,
  autoSelectFamily: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to Mongodb');
});

// setting up graphql endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
