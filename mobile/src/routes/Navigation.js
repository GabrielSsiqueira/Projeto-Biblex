import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
const Stack = createNativeStackNavigator();

export default function Navigation(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="cadastro" component={CadastroScreen} screenOptions={{ headerShown: false }} />
                <Stack.Screen name="dashboard" component={DashboardScreen} screenOptions={{headerShown: false}} />
                <Stack.Screen name="perfil" component={ProfileScreen} screenOptions={{ headerShown: false }} />
                <Stack.Screen name="editPerfil" component={EditProfileScreen} screenOptions={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
   
}