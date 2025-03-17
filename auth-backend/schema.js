import { buildSchema } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import dotenv from 'dotenv';
import { getLanguageGreeting } from './utils/gemini.js';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

// define graphql schema
const schema = buildSchema(`
  type User {
      id: ID!
      email: String!
      password: String!
      loginAttempts: Int!
      lockUntil: Int
      preferredLanguages: String
  }

  type AuthPayload {
      token: String!
      user: User!
  }

  type Query {
      users: [User!]!
      getGreeting(userId: ID!): String
  }

  type Mutation {
      register(email: String!, password: String!, preferredLanguages: String): AuthPayload
      login(email: String!, password: String!): AuthPayload
      updatePreferredLanguages(userId: ID!, preferredLanguages: String!): User
  }

`);

// resolvers for quries and mutations
const resolvers = {
  // getting all users
  users: async () => {
    return await User.find();
  },

  // register new user
  register: async ({ email, password, preferredLanguages }) => {
    // checking is user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create and save user
    const user = new User({
      email,
      password: hashedPassword,
      loginAttempts: 0,
      preferredLanguages: preferredLanguages || '',
    });
    await user.save();

    // create a token
    const token = jwt.sign({ userId: user.id }, secretKey);
    return { token, user };
  },

  // login existing user
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // checking if the account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new Error('Account is locked. Try again after 2 mins.');
    }

    // comparing entered password with the hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // increase login attempts
      user.loginAttempts += 1;
      //locking the account for 2 mins if wrong 5 login attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 2 * 60 * 1000;
      }
      await user.save();
      throw new Error('Invalid password');
    }

    //reset attempts is successful
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // create token
    const token = jwt.sign({ userId: user.id }, secretKey);
    return { token, user };
  },

  // update user
  updatePreferredLanguages: async ({ userId, preferredLanguages }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.preferredLanguages = preferredLanguages;
    await user.save();
    return user;
  },

  getGreeting: async ({ userId }) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Convert the language string to an array
    const languagesArray = user.preferredLanguages && [user.preferredLanguages];
    const greeting = await getLanguageGreeting(languagesArray);
    return greeting;
  },
};

export { schema, resolvers };
