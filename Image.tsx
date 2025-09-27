// Image.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';

const HUGGINGFACE_TOKEN = 'REMOVED_TOKEN'; // Replace with your token

export default function ImageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { imageUri } = route.params || {};

  const [ingredients, setIngredients] = useState<{ name: string; confidence: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeImage = async () => {
    if (!imageUri) return;
    setLoading(true);
    setHasAnalyzed(true);

    try {
      const resized = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 512 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append('file', {
        uri: resized.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(
        'https://api-inference.huggingface.co/models/sayfeldinn/AI-Food-Detector',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
          },
          body: formData,
        }
      );

      const text = await response.text(); // read as text first
      let data: any[] = [];

      try {
        data = JSON.parse(text); // parse JSON
      } catch {
        console.log('Response is not JSON:', text);
      }

      if (Array.isArray(data) && data.length > 0) {
        const parsed = data.map((item: any) => ({
          name: item.label,
          confidence: item.score,
        }));
        setIngredients(parsed);
      } else {
        setIngredients([]);
      }
    } catch (error) {
      console.log('Error analyzing image:', error);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  const goToIngredients = () => {
    navigation.navigate('Ingredients', { ingredients });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Captured Image</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No image captured yet.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
        <Text style={styles.nextButtonText}>{loading ? 'Analyzing...' : 'Analyze Image'}</Text>
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        {hasAnalyzed && (
          ingredients.length > 0 ? (
            ingredients.map((item, idx) => (
              <Text key={idx} style={styles.resultText}>
                {item.name} ({(item.confidence * 100).toFixed(1)}%)
              </Text>
            ))
          ) : (
            !loading && <Text style={styles.resultText}>No food detected</Text>
          )
        )}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToIngredients}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F8F5F0', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FF6B00' },
  image: { width: '100%', height: 300, borderRadius: 12, marginBottom: 20 },
  placeholder: { width: '100%', height: 300, borderRadius: 12, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  analyzeButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, marginBottom: 10 },
  nextButton: { backgroundColor: '#FF6B00', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, marginTop: 20 },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultsContainer: { width: '100%', marginTop: 10 },
  resultText: { fontSize: 16, marginBottom: 4 },
});
