import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  FlatList 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

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
    if (stateArray.includes(value)) {
      setState(stateArray.filter(v => v !== value));
    } else {
      setState([...stateArray, value]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Welcome to SnapFish!</Text>
      <Text style={styles.subtitle}>Let's set up your kitchen</Text>

      {/* Diet */}
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

      {/* Allergies */}
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

      {/* Cuisine Preferences */}
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

      {/* Tools Available */}
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

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------------------- Home / Camera Screen -------------------
function HomeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const INGREDIENTS = ['Onion', 'Tomato', 'Garlic', 'Carrot', 'Potato', 'Spinach', 'Chicken', 'Beef', 'Pork', 'Fish'];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      console.log('Photo taken:', photo.uri);
      // TODO: send `photo.uri` to AI backend for recipe analysis
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = INGREDIENTS.filter((item) =>
        item.toLowerCase().startsWith(text.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!manualMode ? (
        <>
          {/* Camera Preview */}
          <Camera
            style={styles.cameraPreview}
            type="back"  // ✅ fixed: string instead of CameraType
            ref={(ref) => setCameraRef(ref)}
          >
            <View style={styles.topIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="flash" size={24} color="#FF6B00" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="settings" size={24} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </Camera>

          {/* Shutter button */}
          <View style={styles.shutterContainer}>
            <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
              <Ionicons name="camera" size={36} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Manual entry */}
          <TouchableOpacity 
            style={styles.manualEntryButton} 
            onPress={() => setManualMode(true)}
          >
            <Text style={styles.manualEntryText}>Add manually</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Manual Entry Mode */}
          <TextInput
            style={styles.searchInput}
            placeholder="Type ingredient..."
            value={query}
            onChangeText={handleSearch}
          />
          <FlatList
            data={results}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity 
            style={styles.manualEntryButton} 
            onPress={() => setManualMode(false)}
          >
            <Text style={styles.manualEntryText}>Back to Camera</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Bottom nav placeholder */}
      <View style={styles.bottomNav}>
        <Text style={{ color: '#999' }}>Profile | Home | Saved</Text>
      </View>
    </View>
  );
}

// ------------------- Stack Navigator -------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Preferences" component={PreferenceScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------- Styles -------------------
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#F8F5F0',
  },
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
  nextButton: { marginTop: 30, backgroundColor: '#FF6B00', paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#F8F5F0', alignItems: 'center' },
  cameraPreview: { width: '100%', height: '55%', justifyContent: 'flex-end' },
  topIcons: { position: 'absolute', top: 20, right: 20, flexDirection: 'row', gap: 15 },
  iconButton: { marginLeft: 15 },
  shutterContainer: { marginTop: -40, alignItems: 'center' },
  shutterButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF6B00', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  manualEntryButton: { marginTop: 20, backgroundColor: '#FFE6CC', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  manualEntryText: { color: '#FF6B00', fontWeight: '600', fontSize: 16 },
  bottomNav: { position: 'absolute', bottom: 20, alignItems: 'center' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, margin: 10, padding: 12, width: '90%' },
  resultItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
