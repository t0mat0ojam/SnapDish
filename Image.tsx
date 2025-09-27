// Image.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

export default function ImageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { imageUri } = route.params || {};

  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeImage = async () => {
    if (!imageUri) return;
    setLoading(true);
    setHasAnalyzed(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'user',
              content: `Analyze this image and list all food ingredients including type and approximate volume/quantity. Respond as a JSON array of objects with "name" and "quantity". Here is the image in base64: ${base64}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.choices[0].message.content;

      const parsed: { name: string; quantity: string }[] = JSON.parse(text);
      setIngredients(parsed);
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
                {item.name} - {item.quantity}
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
