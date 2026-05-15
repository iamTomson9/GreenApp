import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '../utils/storage';
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from 'react-native';

export const PreferenceContext = createContext();

export const PreferenceProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large'
  const [fontFamily, setFontFamily] = useState('System'); // 'System', 'serif', 'monospace'
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@theme');
      const storedFontSize = await AsyncStorage.getItem('@font_size');
      const storedFontFamily = await AsyncStorage.getItem('@font_family');

      if (storedTheme) setTheme(storedTheme);
      if (storedFontSize) setFontSize(storedFontSize);
      if (storedFontFamily) setFontFamily(storedFontFamily);
    } catch (e) {
      console.error('Failed to load preferences', e);
    } finally {
      setIsReady(true);
    }
  };

  const activeTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;

  // Update background color immediately for smooth transitions
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(activeTheme === 'dark' ? '#121212' : '#F5F5F6');
  }, [activeTheme]);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const updateFontSize = async (newSize) => {
    setFontSize(newSize);
    await AsyncStorage.setItem('@font_size', newSize);
  };

  const updateFontFamily = async (newFamily) => {
    setFontFamily(newFamily);
    await AsyncStorage.setItem('@font_family', newFamily);
  };

  // Font size multiplier
  const getFontSize = (baseSize) => {
    if (fontSize === 'small') return baseSize * 0.85;
    if (fontSize === 'large') return baseSize * 1.15;
    return baseSize;
  };

  if (!isReady) return null; // Or a loading spinner

  return (
    <PreferenceContext.Provider
      value={{
        theme,
        activeTheme,
        updateTheme,
        fontSize,
        updateFontSize,
        fontFamily,
        updateFontFamily,
        getFontSize,
      }}
    >
      {children}
    </PreferenceContext.Provider>
  );
};
