import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PreferenceScreen from './Preferences';
import CameraScreen from './camera';
import ImageScreen from './Image';
import IngredientsScreen from './ingredients';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Preferences">
        <Stack.Screen name="Preferences" component={PreferenceScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Image" component={ImageScreen} />
        <Stack.Screen name="Ingredients" component={IngredientsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
