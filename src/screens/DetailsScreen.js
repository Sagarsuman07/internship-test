import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { movie } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.image?.original }} style={styles.image} />
      <Text style={styles.title}>{movie.name}</Text>
      <Text style={styles.summary}>{movie.summary?.replace(/<[^>]*>/g, '')}</Text>
      <Text style={styles.info}>Language: {movie.language}</Text>
      <Text style={styles.info}>Premiered: {movie.premiered}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  image: { width: '100%', height: 300, resizeMode: 'contain' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 24 },
  summary: { color: '#aaa', marginVertical: 10 },
  info: { color: '#fff', marginTop: 5 },
});

export default DetailsScreen;
