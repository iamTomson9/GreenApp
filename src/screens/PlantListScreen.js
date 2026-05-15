import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { PlantContext } from '../context/PlantContext';
import { AuthContext } from '../context/AuthContext';
import { PreferenceContext } from '../context/PreferenceContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 24;

const FILTERS = ['All', 'Vegetable', 'Herb', 'Flower', 'Easy', 'Medium', 'Hard'];

const PlantListScreen = ({ navigation }) => {
  const { guides } = useContext(PlantContext);
  const { user } = useContext(AuthContext);
  const { activeTheme, getFontSize, fontFamily } = useContext(PreferenceContext);
  const insets = useSafeAreaInsets();
  
  const [activeFilter, setActiveFilter] = useState('All');

  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFF' : '#121212';
  const bgColor = isDark ? '#121212' : '#F5F5F6';

  const filteredGuides = guides
    .filter(g => {
      // show seed guides (no owner) and guides belonging to current user
      if (!g.owner) return true;
      if (!user) return false;
      return g.owner === user.email;
    })
    .filter(guide => {
    if (activeFilter === 'All') return true;
    if (['Vegetable', 'Herb', 'Flower'].includes(activeFilter)) {
      return guide.type.toLowerCase() === activeFilter.toLowerCase();
    }
    if (['Easy', 'Medium', 'Hard'].includes(activeFilter)) {
      return guide.difficulty.toLowerCase() === activeFilter.toLowerCase();
    }
    return true;
  });

  const renderFilter = ({ item }) => {
    const isSelected = activeFilter === item;
    return (
      <TouchableOpacity 
        onPress={() => setActiveFilter(item)}
        style={[
          styles.filterChip,
          { 
            backgroundColor: isSelected ? (isDark ? '#4ADE80' : '#2D5A27') : (isDark ? '#2A2A2A' : '#E0E0E0'),
          }
        ]}
      >
        <Text style={[
          styles.filterText,
          { 
            color: isSelected ? '#FFF' : textColor,
            fontSize: getFontSize(14),
            fontFamily: fontFamily === 'System' ? undefined : fontFamily 
          }
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGuide = ({ item }) => {
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;
    
    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PlantDetail', { id: item.id, title: item.title })}
        style={styles.cardContainer}
      >
        <Image source={imageSource} style={styles.cardImage} />
        {/* Glassmorphism Overlay */}
        <BlurView 
          intensity={60} 
          tint={isDark ? 'dark' : 'light'} 
          style={styles.glassOverlay}
        >
          <Text style={[
            styles.cardTitle, 
            { color: textColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }
          ]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[
            styles.cardSubtitle, 
            { color: isDark ? '#CCC' : '#555', fontSize: getFontSize(12), fontFamily: fontFamily === 'System' ? undefined : fontFamily }
          ]}>
            {item.difficulty} • {item.type}
          </Text>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={{ paddingTop: insets.top + 60 }}>
        <View style={styles.filterContainer}>
          <FlatList
            data={FILTERS}
            renderItem={renderFilter}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>
        
        <FlatList
          data={filteredGuides}
          renderItem={renderGuide}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 160 }]}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: textColor, fontSize: getFontSize(16) }]}>
              No guides found.
            </Text>
          }
        />
      </View>
      
      {/* FAB to add new guide */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: 80 }]}
        onPress={() => navigation.navigate('AddGuide')}
      >
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.fabBlur}>
          <Text style={styles.fabIcon}>+</Text>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#333', // fallback
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  glassOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: '#4ADE80',
    marginTop: -2,
  }
});

export default PlantListScreen;
