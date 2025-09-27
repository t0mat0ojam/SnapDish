import React, { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [query, setQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);

  const allIngredients = [
    'Onion', 'Garlic', 'Tomato', 'Carrot', 'Potato', 'Broccoli',
    'Spinach', 'Chicken', 'Beef', 'Eggs', 'Pork', 'Fish', 'Shrimp',
    'Rice', 'Pasta', 'Cheese', 'Milk', 'Bread',
  ];

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const addIngredient = (item: string) => {
    setSelectedIngredients([...selectedIngredients, item]);
    setQuery('');
  };

  const filtered = query.length > 0
    ? allIngredients.filter(item =>
        item.toLowerCase().includes(query.toLowerCase()) &&
        !selectedIngredients.includes(item)
      )
    : [];

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        navigation.navigate('Image', { imageUri: photo.uri });
      } catch (error) {
        console.log('Error capturing image:', error);
      }
    }
  };

  const goToIngredients = () => {
    navigation.navigate('Ingredients', { ingredients: selectedIngredients });
  };

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={styles.cameraPreview}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      </View>

      {/* Capture Button */}
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={captureImage} />
      </View>

      {/* Flip Camera */}
      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
        <Text style={styles.flipText}>Flip Camera</Text>
      </TouchableOpacity>

      {/* Manual ingredient entry */}
      <TextInput
        style={styles.searchBar}
        placeholder="Manually enter your ingredients!"
        value={query}
        onChangeText={setQuery}
      />
      {filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => addIngredient(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Selected ingredients */}
      <View style={styles.tagsContainer}>
        {selectedIngredients.map((item, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={goToIngredients}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F5F0' },
  message: { textAlign: 'center', marginBottom: 10 },
  permissionButton: { backgroundColor: '#FF6B00', padding: 10, borderRadius: 12, alignItems: 'center' },
  cameraPreview: { height: 250, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  camera: { flex: 1 },
  captureButtonContainer: { alignItems: 'center', marginBottom: 20 },
  captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FF6B00' },
  flipButton: { alignItems: 'center', marginBottom: 10 },
  flipText: { fontSize: 18, color: '#FF6B00', fontWeight: 'bold' },
  searchBar: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
  tag: { backgroundColor: '#FF6B00', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, margin: 4 },
  tagText: { color: '#fff', fontWeight: '600' },
  nextButton: { backgroundColor: '#FF6B00', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
