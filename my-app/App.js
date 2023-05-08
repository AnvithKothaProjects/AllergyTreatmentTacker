import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View, ImageBackground } from 'react-native'
import callGoogleVision from './helper.js'
import ImagePickerComponent from "./Components/ImagePickerComponent"
import Plan from "./Components/Plan"
import EditFood from "./Components/EditFood"
import Tabs from "./Components/Tabs"
import { NavigationContainer, StackActions, NavigationActions, Route, Router } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LogBox } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Background from "../my-app/assets/Background.png"


export default function App() {
  const Stack = createStackNavigator()
  const Tab = createMaterialBottomTabNavigator()
  // LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message

  // #8db045
  // fe3533
  // #7a95af

  Stack.navigationOptions = ({navigation}) => {
    return {
      swipeled: false
    }
  }

  return (
    <NavigationContainer>
        <Stack.Navigator>
          
            <Stack.Screen name="AddImages" options={{headerShown: false, gestureEnabled: false}} component={ImagePickerComponent} initialParams={{comingFromCalendar: false}}/>

            <Stack.Screen name="ShowPlan" component={Plan} options={{headerShown: false, gestureEnabled: false}} initialParams={{bigInd: -1, smallInd: -1, obj: null, shouldRetrieve: true, comingFromHelper: false, data: null, comingFromCalendar: false }}/>

            <Stack.Screen name="EditPlan" component={EditFood} options={{headerShown: false, gestureEnabled: false}}/>

            <Stack.Screen name="Tabs" component={Tabs} options={{headerShown: false, gestureEnabled: false}}/>
          
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

