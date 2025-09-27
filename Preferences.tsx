import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

// ------------------- Preferences Screen -------------------
function PreferenceScreen({ navigation }: any) {
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

      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------------------- Home Screen -------------------
const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const allIngredients = [
    'Onion', 'Garlic', 'Tomato', 'Carrot', 'Potato', 'Broccoli',
    'Spinach', 'Chicken', 'Beef', 'Eggs', 'Pork', 'Fish', 'Shrimp',
    'Rice', 'Pasta', 'Cheese', 'Milk', 'Bread',
  ];

  const filtered = query.length > 0
    ? allIngredients.filter(item =>
        item.toLowerCase().includes(query.toLowerCase()) &&
        !selectedIngredients.includes(item)
      )
    : [];

  const addIngredient = (item: string) => {
    setSelectedIngredients([...selectedIngredients, item]);
    setQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Camera Placeholder */}
      <View style={styles.cameraPreview}>
        <Text style={{ color: '#666' }}>📷 Camera Preview (placeholder)</Text>
      </View>

      {/* Camera button */}
      <View style={styles.shutterContainer}>
        <TouchableOpacity style={styles.shutterButton}>
          <Ionicons name="camera" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Manual entry with autocomplete */}
      <View style={styles.manualEntry}>
        <TextInput
          style={styles.searchBar}
          placeholder="Type ingredient..."
          value={query}
          onChangeText={setQuery}
        />
        {filtered.length > 0 && (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => addIngredient(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Selected ingredient tags */}
        <View style={styles.tagsContainer}>
          {selectedIngredients.map((item, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// ------------------- App Navigation -------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Preferences">
        <Stack.Screen name="Preferences" component={PreferenceScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------- Styles -------------------
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

  // Home screen
  container: { flex: 1, backgroundColor: '#F8F5F0', padding: 20 },
  cameraPreview: { flex: 3, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  shutterContainer: { alignItems: 'center', marginVertical: 20 },
  shutterButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FF6B00', justifyContent: 'center', alignItems: 'center' },
  manualEntry: { flex: 2 },
  searchBar: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: { backgroundColor: '#FF6B00', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, margin: 4 },
  tagText: { color: '#fff', fontWeight: '600' },
});
