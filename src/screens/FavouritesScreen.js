import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { PlantContext } from '../context/PlantContext';
import { PreferenceContext } from '../context/PreferenceContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeartOff } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const FavouritesScreen = ({ navigation }) => {
  const { guides, removeFavourite } = useContext(PlantContext);
  const { activeTheme, getFontSize, fontFamily } = useContext(PreferenceContext);
  const insets = useSafeAreaInsets();

  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFF' : '#121212';
  const bgColor = isDark ? '#121212' : '#F5F5F6';

  const favouriteGuides = guides.filter(g => g.isFavourite);

  const confirmRemove = (id, title) => {
    Alert.alert(
      'Remove Favourite',
      `Are you sure you want to remove ${title} from your favourites? It will remain in your main guides list.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFavourite(id)
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
        onPress={() => navigation.navigate('HomeTab', { screen: 'PlantDetail', params: { id: item.id } })}
      >
        <Image source={imageSource} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>{item.title}</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666', fontSize: getFontSize(12), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>{item.type}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeBtn} 
          onPress={() => confirmRemove(item.id, item.title)}
        >
          <HeartOff color="#EF4444" size={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={[styles.headerTitle, { color: textColor, fontSize: getFontSize(24), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>My Favourites</Text>
      </BlurView>
      
      <FlatList
        data={favouriteGuides}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 120 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <HeartOff color={isDark ? '#555' : '#CCC'} size={64} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyText, { color: textColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>
              You have no favourite guides yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    textTransform: 'capitalize',
  },
  removeBtn: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  }
});

export default FavouritesScreen;
