import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PlanPerDay from "./PlanPerDay"
import ShoppingResults from "./ShoppingResults"
import { useTheme } from 'react-native-paper';
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialBottomTabNavigator();

export default function Tabs({ navigation, route }) {
    const theme = useTheme();
    theme.colors.secondaryContainer = ""

    return (
        <Tab.Navigator activeColor="#3f57e0"
        barStyle={{ backgroundColor: '#d8e8ed' }}>
            <Tab.Screen
                name="PlanPerDay"
                component={PlanPerDay}
                options={{
                    tabBarLabel: 'Calendar',
                    tabBarColor: '#3f57e0',
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons name="calendar-check-outline" color={color} size={26}/>
                    )
                }}
            />

            <Tab.Screen
                name="ApiScren"
                component={ShoppingResults}
                options={{
                    tabBarLabel: 'Shopping',
                    tabBarIcon: ({color}) => (
                        <MaterialCommunityIcons name="shopping-outline" color={color} size={26}/>
                    )
                }}
            />
        </Tab.Navigator>
    )
}