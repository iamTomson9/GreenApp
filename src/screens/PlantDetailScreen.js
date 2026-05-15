import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { PlantContext } from '../context/PlantContext';
import { PreferenceContext } from '../context/PreferenceContext';
import { Heart, Droplets, Sun, Bug, Scissors } from 'lucide-react-native';

const PlantDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { guides, toggleFavourite } = useContext(PlantContext);
  const { activeTheme, getFontSize, fontFamily } = useContext(PreferenceContext);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const guide = guides.find(g => g.id === id);
  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFF' : '#121212';
  const bgColor = isDark ? '#121212' : '#F5F5F6';

  if (!guide) return <View style={styles.container}><Text>Guide not found.</Text></View>;

  const imageSource = typeof guide.image === 'string' ? { uri: guide.image } : guide.image;
  
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToastVisible(false));
      }, 2000);
    });
  };

  const handleFavourite = () => {
    toggleFavourite(id);
    showToast(!guide.isFavourite ? 'Added to Favourites' : 'Removed from Favourites');
  };

  const renderDetailItem = (Icon, label, value) => (
    <View style={styles.detailRow}>
      <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0' }]}>
        <Icon color={isDark ? '#4ADE80' : '#2D5A27'} size={20} />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={[styles.detailLabel, { color: isDark ? '#AAA' : '#666', fontSize: getFontSize(12), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: textColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={styles.imageOverlay}>
            <Text style={[styles.title, { color: isDark ? '#FFF' : '#000', fontSize: getFontSize(32), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>
              {guide.title}
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#DDD' : '#333', fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>
              {guide.difficulty} • {guide.type}
            </Text>
          </BlurView>
        </View>

        <View style={styles.content}>
          <View style={[styles.glassCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
            {renderDetailItem(Sun, 'Sunlight', guide.sunlight)}
            {renderDetailItem(Droplets, 'Watering', guide.wateringFrequency)}
            {renderDetailItem(Scissors, 'Soil', guide.soilType)}
            {renderDetailItem(Bug, 'Pests', guide.pests)}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button for Favourite */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: guide.isFavourite ? '#EF4444' : (isDark ? '#4ADE80' : '#2D5A27') }]} 
        onPress={handleFavourite}
      >
        <Heart color="#FFF" size={24} fill={guide.isFavourite ? "#FFF" : "transparent"} />
      </TouchableOpacity>

      {/* Custom Toast Notification using Glassmorphism */}
      {toastVisible && (
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}> 
          <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.toastBlur}>
            <Text style={[styles.toastText, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>{toastMessage}</Text>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40, // Fade gradient effect
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    textTransform: 'capitalize',
    marginTop: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  glassCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  toastBlur: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  toastText: {
    fontWeight: '600',
  }
});

export default PlantDetailScreen;
