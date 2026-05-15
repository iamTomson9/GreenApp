import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { PreferenceContext } from '../context/PreferenceContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Droplets, ArrowDownUp } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const ML_TO_FLOZ = 0.033814;
const FLOZ_TO_ML = 29.5735;

const CalculatorScreen = () => {
  const { activeTheme, getFontSize, fontFamily } = useContext(PreferenceContext);
  const insets = useSafeAreaInsets();

  const [mlValue, setMlValue] = useState('');
  const [flOzValue, setFlOzValue] = useState('');

  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFF' : '#121212';
  const bgColor = isDark ? '#121212' : '#F5F5F6';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const accentColor = isDark ? '#4ADE80' : '#2D5A27';

  const handleMlChange = (val) => {
    setMlValue(val);
    if (val === '') {
      setFlOzValue('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFlOzValue((num * ML_TO_FLOZ).toFixed(1));
    }
  };

  const handleFlOzChange = (val) => {
    setFlOzValue(val);
    if (val === '') {
      setMlValue('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setMlValue((num * FLOZ_TO_ML).toFixed(0));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: bgColor }]} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={[styles.headerTitle, { color: textColor, fontSize: getFontSize(24), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Watering Calculator</Text>
        </BlurView>

        <View style={styles.content}>
          <View style={[styles.iconWrapper, { backgroundColor: cardBg }]}>
            <Droplets color={accentColor} size={48} />
          </View>
          
          <Text style={[styles.description, { color: isDark ? '#AAA' : '#666', fontSize: getFontSize(14), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>
            Easily convert between millilitres (ml) and fluid ounces (fl oz) for your watering cans.
          </Text>

          <View style={styles.calcContainer}>
            {/* ML Input */}
            <View style={[styles.inputGroup, { backgroundColor: cardBg }]}>
              <TextInput
                style={[styles.input, { color: textColor, fontSize: getFontSize(32), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
                keyboardType="numeric"
                value={mlValue}
                onChangeText={handleMlChange}
                placeholder="0"
                placeholderTextColor={isDark ? '#555' : '#CCC'}
              />
              <Text style={[styles.unit, { color: accentColor, fontSize: getFontSize(18), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>ml</Text>
            </View>

            <View style={styles.divider}>
              <ArrowDownUp color={isDark ? '#555' : '#AAA'} size={24} />
            </View>

            {/* FL OZ Input */}
            <View style={[styles.inputGroup, { backgroundColor: cardBg }]}>
              <TextInput
                style={[styles.input, { color: textColor, fontSize: getFontSize(32), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}
                keyboardType="numeric"
                value={flOzValue}
                onChangeText={handleFlOzChange}
                placeholder="0.0"
                placeholderTextColor={isDark ? '#555' : '#CCC'}
              />
              <Text style={[styles.unit, { color: accentColor, fontSize: getFontSize(18), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>fl oz</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120, // accommodate bottom tab
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  description: {
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  calcContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
  },
  input: {
    flex: 1,
    fontWeight: 'bold',
  },
  unit: {
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    paddingVertical: 16,
  }
});

export default CalculatorScreen;
