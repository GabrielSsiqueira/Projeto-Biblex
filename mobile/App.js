import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import  Navigation from "./src/routes/Navigation";

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
    
  );
}
