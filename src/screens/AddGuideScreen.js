import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PlantContext } from '../context/PlantContext';
import { PreferenceContext } from '../context/PreferenceContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const AddGuideScreen = ({ navigation }) => {
  const { addGuide } = useContext(PlantContext);
  const { activeTheme, getFontSize, fontFamily } = useContext(PreferenceContext);
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('vegetable');
  const [sunlight, setSunlight] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [wateringFrequency, setWateringFrequency] = useState('');
  const [soilType, setSoilType] = useState('');
  const [pests, setPests] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFF' : '#121212';
  const bgColor = isDark ? '#121212' : '#F5F5F6';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You've refused to allow this app to access your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a plant name.');
      return;
    }

    const newGuide = {
      title,
      type,
      sunlight: sunlight || 'Unknown',
      difficulty,
      wateringFrequency: wateringFrequency || 'Unknown',
      soilType: soilType || 'Unknown',
      pests: pests || 'None noted',
      image: imageUri || 'https://via.placeholder.com/300/4ADE80/FFFFFF?text=New+Plant',
    };

    addGuide(newGuide);
    navigation.goBack();
  };

  const renderSelector = (label, options, selected, onSelect) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>{label}</Text>
      <View style={styles.selectorRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.selectorBtn,
              { 
                backgroundColor: selected === opt ? (isDark ? '#4ADE80' : '#2D5A27') : inputBg,
                borderColor: borderColor
              }
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text style={{ 
              color: selected === opt ? '#FFF' : textColor,
              textTransform: 'capitalize',
              fontFamily: fontFamily === 'System' ? undefined : fontFamily
            }}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: 120, paddingHorizontal: 20 }}>
        
        <View style={styles.imagePickerContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: inputBg, borderColor }]}>
              <Text style={{ color: isDark ? '#888' : '#AAA', fontFamily: fontFamily === 'System' ? undefined : fontFamily }}>No Image Selected</Text>
            </View>
          )}
          
          <View style={styles.imageBtnRow}>
            <TouchableOpacity style={[styles.imageBtn, { backgroundColor: isDark ? '#4ADE80' : '#2D5A27' }]} onPress={takePhoto}>
              <Text style={styles.imageBtnText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imageBtn, { backgroundColor: isDark ? '#4ADE80' : '#2D5A27' }]} onPress={pickImage}>
              <Text style={styles.imageBtnText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Plant Name</Text>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
            placeholder="e.g., Cherry Tomato"
            placeholderTextColor={isDark ? '#888' : '#AAA'}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {renderSelector('Type', ['vegetable', 'herb', 'flower'], type, setType)}
        {renderSelector('Difficulty', ['easy', 'medium', 'hard'], difficulty, setDifficulty)}

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Sunlight Needs</Text>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
            placeholder="e.g., Full sun, 6+ hours"
            placeholderTextColor={isDark ? '#888' : '#AAA'}
            value={sunlight}
            onChangeText={setSunlight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Watering Frequency</Text>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
            placeholder="e.g., Every 2 days"
            placeholderTextColor={isDark ? '#888' : '#AAA'}
            value={wateringFrequency}
            onChangeText={setWateringFrequency}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Soil Type</Text>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
            placeholder="e.g., Well-drained"
            placeholderTextColor={isDark ? '#888' : '#AAA'}
            value={soilType}
            onChangeText={setSoilType}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor, fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Common Pests</Text>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
            placeholder="e.g., Aphids"
            placeholderTextColor={isDark ? '#888' : '#AAA'}
            value={pests}
            onChangeText={setPests}
          />
        </View>

        <TouchableOpacity 
          style={styles.saveBtn}
          onPress={handleSave}
        >
          <BlurView intensity={80} tint="light" style={styles.saveBlur}>
            <Text style={[styles.saveText, { fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Save Guide</Text>
          </BlurView>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtn: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#4ADE80',
    elevation: 3,
  },
  saveBlur: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  saveText: {
    color: '#121212', // Keep contrast high on the green
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  imagePickerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  imageBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  imageBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

export default AddGuideScreen;
