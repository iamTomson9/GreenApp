import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { PreferenceContext } from '../context/PreferenceContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const PreferencesScreen = () => {
  const { 
    theme, updateTheme, activeTheme, 
    fontSize, updateFontSize, 
    fontFamily, updateFontFamily,
    getFontSize 
  } = useContext(PreferenceContext);
  
  const insets = useSafeAreaInsets();

  const isDark = activeTheme === 'dark';
  const textColor = isDark ? '#FFF' : '#121212';
  const bgColor = isDark ? '#121212' : '#F5F5F6';
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const activeColor = isDark ? '#4ADE80' : '#2D5A27';

  const renderSegmentedControl = (options, selected, onSelect) => (
    <View style={[styles.segmentedControl, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)' }]}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.segmentBtn,
              isSelected && { backgroundColor: isDark ? '#333' : '#FFF', elevation: isSelected ? 2 : 0, shadowOpacity: isSelected ? 0.1 : 0 }
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={{ 
              color: isSelected ? activeColor : (isDark ? '#AAA' : '#666'),
              fontWeight: isSelected ? 'bold' : 'normal',
              textTransform: 'capitalize',
              fontFamily: fontFamily === 'System' ? undefined : fontFamily
            }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={[styles.headerTitle, { color: textColor, fontSize: getFontSize(24), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Preferences</Text>
      </BlurView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        
        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: getFontSize(18), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Appearance</Text>
          
          <View style={styles.row}>
            <Text style={[styles.label, { color: isDark ? '#CCC' : '#444', fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Dark Mode</Text>
            <Switch
              value={theme === 'dark' || (theme === 'system' && isDark)}
              onValueChange={(val) => updateTheme(val ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: activeColor }}
              thumbColor={'#f4f3f4'}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
          
          <View style={styles.row}>
            <Text style={[styles.label, { color: isDark ? '#CCC' : '#444', fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Use System Theme</Text>
            <Switch
              value={theme === 'system'}
              onValueChange={(val) => updateTheme(val ? 'system' : (isDark ? 'dark' : 'light'))}
              trackColor={{ false: '#767577', true: activeColor }}
              thumbColor={'#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor, fontSize: getFontSize(18), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Typography</Text>
          
          <Text style={[styles.label, { color: isDark ? '#CCC' : '#444', marginBottom: 12, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Font Family</Text>
          {renderSegmentedControl([
            { label: 'System', value: 'System' },
            { label: 'Serif', value: 'serif' },
            { label: 'Mono', value: 'monospace' },
          ], fontFamily, updateFontFamily)}

          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', marginVertical: 20 }]} />

          <Text style={[styles.label, { color: isDark ? '#CCC' : '#444', marginBottom: 12, fontSize: getFontSize(16), fontFamily: fontFamily === 'System' ? undefined : fontFamily }]}>Font Size</Text>
          {renderSegmentedControl([
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ], fontSize, updateFontSize)}

        </View>

      </ScrollView>
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
  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.1)',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  }
});

export default PreferencesScreen;
