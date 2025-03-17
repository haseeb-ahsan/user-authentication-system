# User Authentication System

A full-stack user authentication system built with Next.js (frontend) and Node.js/GraphQL (backend). This project includes user registration, login, and logout functionalities with secure password hashing, token-based authentication, and additional features like account lockout after 5 failed attempts and personalized greetings powered by Gemini AI.

## Features

- **User Registration, Login, and Logout:** Securely create and manage user sessions.
- **Password Hashing & Salting:** Uses bcrypt to securely store passwords.
- **GraphQL API:** Communication between frontend and backend.
- **MongoDB Database:** Stores user information securely.
- **Responsive, Modern UI:** Built with Next.js and styled using Tailwind CSS.
- **Account Lockout:** Locks out users after 5 incorrect login attempts.
- **Loading Indicators:** Provides user feedback during API requests.
- **Personalized Greetings:** Users can update their preferred languages and receive greetings generated via Gemini AI.

## Technologies Used

### Backend
- Node.js
- Express
- GraphQL & express-graphql
- MongoDB & Mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- @google/generative-ai
- nodemon

### Frontend
- Next.js
- React
- Apollo Client
- Tailwind CSS

## Installation

### Backend Setup
1. Navigate to the `auth-backend` folder.
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file in the auth-backend folder and add:
   GEMINI_API_KEY=your_gemini_api_key
4. Start the backend server:
   npm run dev

The server runs on http://localhost:4000/graphql

### Frontend Setup
1. Navigate to the `auth-frontend` folder.
2. Install dependencies:
   ```bash
   npm install
3. Create a .env.local file in the auth-frontend folder and add:
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql

4. Start the developement server:
   npm run dev

The server runs on http://localhost:3000.
