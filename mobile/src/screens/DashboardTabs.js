import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, StyleSheet} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

import BibleScreen from './BibleScreen';
import StudyPlanScreen from './StudyPlanScreen';
import IndexScreen from './IndexScreen';
import CreatePlanScreen from './CreatePlanScreen';
import DashboardPanelAdmin from './DashboardPanelAdmin';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';

const Tab = createBottomTabNavigator();

const DashboardTabs =() => {
    const { user } = useContext(AuthContext);

    abas = [];


    if(user?.tipo_usuario === 'admin'){
      abas.push(
        <Tab.Screen key="admin" name="Home" component={DashboardPanelAdmin}></Tab.Screen>
      );
    }else{
      abas.push(
        <Tab.Screen key="Home" name="Home" component={IndexScreen}></Tab.Screen>
      )
    }

    abas.push(
        <Tab.Screen key="Biblia" name="Biblia" component={BibleScreen}></Tab.Screen>
    )

    abas.push(
        <Tab.Screen key="Estudo" name="Estudo" component={StudyPlanScreen}></Tab.Screen>
    )

    if(user?.tipo_usuario === 'autor'){
        abas.push(
            <Tab.Screen key="Plano" name="Plano" component={CreatePlanScreen}></Tab.Screen>
        )
    }

    abas.push(
        <Tab.Screen key="EditPerfil" name="EditPerfil" component={EditProfileScreen}></Tab.Screen>
    )

   
    return(
        <Tab.Navigator 
           screenOptions={({ route }) => ({
            tabBarIcon:({focused, color, size}) => {
                let iconName;

                if(route.name === 'Home'){
                    iconName = focused ? 'home' : 'home-outline';
                }else if (route.name === 'Biblia'){
                    iconName = focused ? 'book-open': 'book-open-outline';
                }else if(route.name === 'Estudo'){
                    iconName = focused ? 'notebook' : 'notebook-outline';
                }else if(route.name === 'Plano'){
                    iconName = focused ? 'plus-box' : 'plus-box-outline';
                }else if(route.name === 'EditPerfil'){
                    iconName = focused ? 'account': 'account-outline';
                }

                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007bff',
            tabBarActiveTintColor: 'gray',
            headerShown: false,
           })}
        >

         {abas} 
        </Tab.Navigator>
    )
}

export default DashboardTabs;