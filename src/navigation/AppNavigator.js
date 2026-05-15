import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text } from 'react-native';
import { Home, Heart, Calculator, Settings } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

import { PreferenceContext } from '../context/PreferenceContext';
import { AuthContext } from '../context/AuthContext';

// Import Screens
import PlantListScreen from '../screens/PlantListScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import AddGuideScreen from '../screens/AddGuideScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import PreferencesScreen from '../screens/PreferencesScreen';

// Auth Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const { activeTheme, fontFamily } = useContext(PreferenceContext);
  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: isDark ? 'dark' : 'light',
        headerTintColor: textColor,
        headerTitleStyle: {
          fontFamily: fontFamily === 'System' ? undefined : fontFamily,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Guides" 
        component={PlantListScreen} 
        options={{ title: 'MyGreenGarden' }}
      />
      <Stack.Screen 
        name="PlantDetail" 
        component={PlantDetailScreen} 
        options={({ route }) => ({ title: route.params?.title || 'Guide Details' })}
      />
      <Stack.Screen 
        name="AddGuide" 
        component={AddGuideScreen} 
        options={{ title: 'Add New Guide' }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { activeTheme } = useContext(PreferenceContext);
  const { isLoading, userToken } = useContext(AuthContext);
  const isDark = activeTheme === 'dark';
  
  const activeColor = isDark ? '#4ADE80' : '#2D5A27';
  const inactiveColor = isDark ? '#888888' : '#A0A0A0';

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {userToken ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: route.name !== 'HomeTab',
            headerTransparent: true,
            headerBlurEffect: isDark ? 'dark' : 'light',
            headerTintColor: isDark ? '#FFF' : '#000',
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'HomeTab') return <Home color={color} size={size} />;
              if (route.name === 'Favourites') return <Heart color={color} size={size} />;
              if (route.name === 'Calculator') return <Calculator color={color} size={size} />;
              if (route.name === 'Preferences') return <Settings color={color} size={size} />;
            },
            tabBarActiveTintColor: activeColor,
            tabBarInactiveTintColor: inactiveColor,
            tabBarStyle: {
              position: 'absolute',
              borderTopWidth: 0,
              elevation: 0,
              height: 60,
            },
            tabBarBackground: () => (
              <BlurView
                tint={isDark ? 'dark' : 'light'}
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            ),
          })}
        >
          <Tab.Screen 
            name="HomeTab" 
            component={HomeStack} 
            options={{ title: 'Guides' }}
          />
          <Tab.Screen 
            name="Favourites" 
            component={FavouritesScreen} 
          />
          <Tab.Screen 
            name="Calculator" 
            component={CalculatorScreen} 
            options={{ title: 'Watering Calc' }}
          />
          <Tab.Screen 
            name="Preferences" 
            component={PreferencesScreen} 
          />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
