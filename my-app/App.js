import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import callGoogleVision from './helper.js'
import ImagePickerComponent from "./Components/ImagePickerComponent"
import Plan from "./Components/Plan"
import EditFood from "./Components/EditFood"
import Tabs from "./Components/Tabs"
import { NavigationContainer, StackActions, NavigationActions, Route, Router } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LogBox } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'


export default function App() {
  const Stack = createStackNavigator()
  const Tab = createMaterialBottomTabNavigator()
  // LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message

  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="AddImages" options={{headerShown: false}} component={ImagePickerComponent}/>

        <Stack.Screen name="ShowPlan" component={Plan} options={{headerShown: false}} initialParams={{bigInd: -1, smallInd: -1, obj: null, firstTime: true, comingFromHelper: false, data: null }}/>

        <Stack.Screen name="EditPlan" component={EditFood} options={{headerShown: false}}/>

        <Stack.Screen name="Tabs" component={Tabs} options={{headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

