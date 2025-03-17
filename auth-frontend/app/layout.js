
'use client';

import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <ApolloProvider client={client}>
          <AuthProvider>{children}</AuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
