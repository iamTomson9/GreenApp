import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '../utils/storage';
import { AuthContext } from './AuthContext';

export const PlantContext = createContext();

const initialGuides = [
  {
    id: '1',
    title: 'Tomato',
    type: 'vegetable',
    sunlight: 'full sun',
    difficulty: 'medium',
    wateringFrequency: 'Every 1-2 days',
    soilType: 'Well-drained, fertile',
    pests: 'Aphids, Hornworms',
    image: require('../../assets/plants/tomato.png'),
    isFavourite: false,
  },
  {
    id: '2',
    title: 'Spinach',
    type: 'vegetable',
    sunlight: 'partial shade',
    difficulty: 'easy',
    wateringFrequency: 'Every 2-3 days',
    soilType: 'Moist, nitrogen-rich',
    pests: 'Leaf miners, Slugs',
    image: require('../../assets/plants/spinach.png'),
    isFavourite: false,
  },
  {
    id: '3',
    title: 'Basil',
    type: 'herb',
    sunlight: 'full sun',
    difficulty: 'easy',
    wateringFrequency: 'Every 2-3 days',
    soilType: 'Well-drained, moist',
    pests: 'Aphids, Japanese beetles',
    image: require('../../assets/plants/basil.png'),
    isFavourite: false,
  }
];

export const PlantProvider = ({ children }) => {
  const [guides, setGuides] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      const storedGuides = await AsyncStorage.getItem('@plant_guides');
      if (storedGuides) {
        // We need to parse and reconstruct images if they were local requires, 
        // but for simplicity, we'll merge them or just rely on stored string URIs for new ones.
        // For the seed data, local requires can't be easily JSON serialized/deserialized properly if they are numbers.
        // Let's handle this carefully:
        const parsed = JSON.parse(storedGuides);
        // Ensure initial guides are always present if not in parsed (by ID)
        const merged = [...initialGuides];
        parsed.forEach(p => {
          const index = merged.findIndex(g => g.id === p.id);
          if (index !== -1) {
            merged[index] = { ...merged[index], ...p, image: merged[index].image }; // keep local require for seed
          } else {
            merged.push(p);
          }
        });
        setGuides(merged);
      } else {
        setGuides(initialGuides);
      }
    } catch (e) {
      console.error('Failed to load guides', e);
      setGuides(initialGuides);
    } finally {
      setIsReady(true);
    }
  };

  const saveGuides = async (newGuides) => {
    try {
      setGuides(newGuides);
      // Don't stringify local requires directly if they break, but Expo handles it as numbers.
      // We will only store essential data and URI strings for user-added guides.
      await AsyncStorage.setItem('@plant_guides', JSON.stringify(newGuides));
    } catch (e) {
      console.error('Failed to save guides', e);
    }
  };

  const addGuide = async (newGuide) => {
    const ownerEmail = user?.email || null;
    const updatedGuides = [...guides, { ...newGuide, id: Date.now().toString(), isFavourite: false, owner: ownerEmail }];
    await saveGuides(updatedGuides);
  };

  const toggleFavourite = async (id) => {
    const updatedGuides = guides.map(g => 
      g.id === id ? { ...g, isFavourite: !g.isFavourite } : g
    );
    await saveGuides(updatedGuides);
  };

  const removeFavourite = async (id) => {
    const updatedGuides = guides.map(g => 
      g.id === id ? { ...g, isFavourite: false } : g
    );
    await saveGuides(updatedGuides);
  };

  if (!isReady) return null;

  return (
    <PlantContext.Provider
      value={{
        guides,
        addGuide,
        toggleFavourite,
        removeFavourite,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};
