'use client';
import { useContext, createContext } from 'react';

const TestContext = createContext();

export default function TestClient() {
  const value = useContext(TestContext);
  return (
    <div>
      <p>Test Client Component</p>
      <p>Value: {value}</p>
    </div>
  );
}
