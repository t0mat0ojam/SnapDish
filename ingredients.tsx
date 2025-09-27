import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface IngredientsScreenProps {
  route: any;
}

export default function IngredientsScreen({ route }: IngredientsScreenProps) {
  const { ingredients } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Ingredients</Text>
      {ingredients && ingredients.length > 0 ? (
        <FlatList
          data={ingredients}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No ingredients selected yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F5F0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 12, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
});
