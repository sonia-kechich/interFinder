import React, { createContext, useContext, useState } from 'react';
import { MOCK_USER } from '../utils/mock/data';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (_email: string, _password: string) => {
    // TODO: Replace with real API authentication (token storage, credential validation)
    // before any production deployment. This currently sets a mock user directly.
    setUser(MOCK_USER);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
