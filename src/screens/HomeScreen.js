import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://api.tvmaze.com/search/shows?q=all');
      setMovies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Movies..."
        style={styles.searchBar}
        onFocus={() => navigation.navigate('Search')}
      />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.show.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { movie: item.show })}>
            <View style={styles.movieContainer}>
              <Image source={{ uri: item.show.image?.medium }} style={styles.thumbnail} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.show.name}</Text>
                <Text style={styles.summary}>{item.show.summary?.replace(/<[^>]*>/g, '')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  movieContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  thumbnail: { width: 80, height: 80 },
  info: { marginLeft: 10, flexShrink: 1 },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  summary: { color: '#aaa' },
});

export default HomeScreen;
