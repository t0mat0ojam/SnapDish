// Image.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ImageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { imageUri } = route.params || {};

  const goToIngredients = () => {
    navigation.navigate('Ingredients');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Captured Image</Text>
      
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No image captured yet.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={goToIngredients}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F5F0', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF6B00' },
  image: { width: '100%', height: 300, borderRadius: 12, marginBottom: 20 },
  placeholder: { width: '100%', height: 300, borderRadius: 12, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  nextButton: { backgroundColor: '#FF6B00', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
