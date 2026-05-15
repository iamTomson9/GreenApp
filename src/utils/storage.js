import AsyncStorage from '@react-native-async-storage/async-storage';

const memory = new Map();
const hasNative = !!(AsyncStorage && AsyncStorage.getItem);

export default {
  getItem: async (k) => {
    if (hasNative) {
      try { return await AsyncStorage.getItem(k); } catch { return memory.get(k) ?? null; }
    }
    return memory.get(k) ?? null;
  },
  setItem: async (k, v) => {
    if (hasNative) {
      try { return await AsyncStorage.setItem(k, v); } catch { memory.set(k, v); }
    } else { memory.set(k, v); }
  },
  removeItem: async (k) => {
    if (hasNative) {
      try { return await AsyncStorage.removeItem(k); } catch { memory.delete(k); }
    } else { memory.delete(k); }
  }
};
