import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchMovies = async () => {
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a movie..."
        style={styles.searchBar}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchMovies}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.show.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { movie: item.show })}>
            <View style={styles.resultContainer}>
              <Image source={{ uri: item.show.image?.medium }} style={styles.thumbnail} />
              <Text style={styles.title}>{item.show.name}</Text>
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
  resultContainer: { flexDirection: 'row', padding: 10 },
  thumbnail: { width: 60, height: 60 },
  title: { color: '#fff', marginLeft: 10, alignSelf: 'center' },
});

export default SearchScreen;
