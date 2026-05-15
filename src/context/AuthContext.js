import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Delay for Splash Screen visibility (e.g. 2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seed a simple test user on first run if users list doesn't exist
        const usersJson = await AsyncStorage.getItem('users');
        if (!usersJson) {
          const seed = [{ name: 'Test User', email: 'test@example.com', password: 'password123' }];
          await AsyncStorage.setItem('users', JSON.stringify(seed));
        }

        const token = await AsyncStorage.getItem('userToken');
        const userJson = await AsyncStorage.getItem('user');
        if (token) {
          setUserToken(token);
          setUser(userJson ? JSON.parse(userJson) : null);
        }
      } catch (e) {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        return { ok: false, error: 'Invalid email or password' };
      }

      const token = `token-${Date.now()}`;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify({ email: foundUser.email, name: foundUser.name }));
      setUserToken(token);
      setUser({ email: foundUser.email, name: foundUser.name });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name, email, password) => {
    setIsLoading(true);
    try {
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      if (users.some(u => u.email === email)) {
        return { ok: false, error: 'User with this email already exists' };
      }

      const newUser = { name: name || (email ? email.split('@')[0] : 'User'), email: email || null, password: password || '' };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      const token = `token-${Date.now()}`;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify({ email: newUser.email, name: newUser.name }));
      setUserToken(token);
      setUser({ email: newUser.email, name: newUser.name });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      setUserToken(null);
      setUser(null);
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
