import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { FilterProvider } from './src/context/FilterContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <FilterProvider>
          <AppNavigator />
        </FilterProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
