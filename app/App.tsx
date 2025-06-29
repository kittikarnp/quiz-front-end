import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HistoryScreen from './(tabs)/HistoryScreen';
import HomeScreen from './(tabs)/index';
import QuizScreen from './(tabs)/QuestionScreen';
import ResultScreen from './screens/SummaryScreen'; // ✅ ถูกต้อง
 

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Quiz" component={QuizScreen} />
                <Stack.Screen name="Result" component={ResultScreen} /> 
                <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
                
            </Stack.Navigator>
        </NavigationContainer>
    );
}
