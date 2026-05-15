import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PreferenceProvider, PreferenceContext } from './src/context/PreferenceContext';
import { PlantProvider } from './src/context/PlantContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Wrapper component to set status bar color dynamically based on theme
const AppContent = () => {
  const { activeTheme } = React.useContext(PreferenceContext);
  return (
    <>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <PreferenceProvider>
      <AuthProvider>
        <PlantProvider>
          <AppContent />
        </PlantProvider>
      </AuthProvider>
    </PreferenceProvider>
  );
}
