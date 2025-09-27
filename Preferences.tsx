import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PreferencesProps {
  navigation: any;
}

export default function PreferenceScreen({ navigation }: PreferencesProps) {
  const [diet, setDiet] = useState<string | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);

  const dietOptions = ['None', 'Vegan', 'Vegetarian', 'Keto', 'Pescatarian'];
  const allergyOptions = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy', 'Eggs', 'Tree Nuts'];
  const cuisineOptions = ['Italian', 'Japanese', 'Quick Meals', 'Mexican', 'Indian', 'Mediterranean'];
  const toolsOptions = ['Oven', 'Stove', 'Microwave', 'Air Fryer', 'Blender', 'Slow Cooker'];

  const toggleSelection = (value: string, stateArray: string[], setState: Function) => {
    if (stateArray.includes(value)) setState(stateArray.filter(v => v !== value));
    else setState([...stateArray, value]);
  };

  const handleNext = () => {
    navigation.navigate('Camera', {
      diet,
      allergies,
      cuisines,
      tools,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Welcome to SnapDish!</Text>
      <Text style={styles.subtitle}>Let's set up your kitchen</Text>

      <Text style={styles.section}>Pick Your Diet</Text>
      <View style={styles.optionsContainer}>
        {dietOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.dietButton, diet === option && styles.dietButtonSelected]}
            onPress={() => setDiet(option)}
          >
            <Text style={diet === option ? styles.dietTextSelected : styles.dietText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Allergies</Text>
      <View style={styles.optionsContainer}>
        {allergyOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.dropdownBox, allergies.includes(option) && styles.dropdownBoxSelected]}
            onPress={() => toggleSelection(option, allergies, setAllergies)}
          >
            <Text style={allergies.includes(option) ? styles.dropdownTextSelected : styles.dropdownText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Cuisine Preferences</Text>
      <View style={styles.optionsContainer}>
        {cuisineOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.dropdownBox, cuisines.includes(option) && styles.dropdownBoxSelected]}
            onPress={() => toggleSelection(option, cuisines, setCuisines)}
          >
            <Text style={cuisines.includes(option) ? styles.dropdownTextSelected : styles.dropdownText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Tools Available</Text>
      <View style={styles.optionsContainer}>
        {toolsOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.dropdownBox, tools.includes(option) && styles.dropdownBoxSelected]}
            onPress={() => toggleSelection(option, tools, setTools)}
          >
            <Text style={tools.includes(option) ? styles.dropdownTextSelected : styles.dropdownText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 50, backgroundColor: '#F8F5F0' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, color: '#FF6B00' },
  subtitle: { fontSize: 16, marginBottom: 20, color: '#333' },
  section: { fontSize: 18, marginTop: 20, marginBottom: 10, color: '#4CAF50', fontWeight: '600' },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  dietButton: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, backgroundColor: '#FFE6CC', margin: 5 },
  dietButtonSelected: { backgroundColor: '#FF6B00' },
  dietText: { color: '#333' },
  dietTextSelected: { color: '#fff', fontWeight: '600' },
  dropdownBox: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', margin: 5, borderWidth: 1, borderColor: '#DDD' },
  dropdownBoxSelected: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },
  dropdownText: { color: '#333' },
  dropdownTextSelected: { color: '#fff', fontWeight: '600' },
  nextButton: { marginTop: 30, backgroundColor: '#FF6B00', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
