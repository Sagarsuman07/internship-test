import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    axios.get('https://api.tvmaze.com/search/shows?q=all')
      .then(response => setMovies(response.data))
      .catch(error => console.error(error));
  }, []);

  const renderMovie = ({ item }) => {
    const imageUri = item.show.image ? item.show.image.medium : 'https://via.placeholder.com/100x150?text=No+Image';

    return (
      <TouchableOpacity
        key={item.show.id}
        onPress={() => navigation.navigate('Details', { movie: item.show })}
        style={styles.movieContainer}
      >
        <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        <Text style={styles.movieTitle}>{item.show.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Movies..."
        onFocus={() => navigation.navigate('Search')}
      />
      <Text style={styles.sectionTitle}>Popular Movies</Text>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.show.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </ScrollView>
  );
};

// Details Screen
const DetailsScreen = ({ route }) => {
  const { movie } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: movie.image?.original }} style={styles.image} />
      <Text style={styles.movieTitle}>{movie.name}</Text>
      <Text style={styles.summary}>{movie.summary?.replace(/<[^>]*>/g, '')}</Text>
    </View>
  );
};

// Search Screen
const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);

  const searchMovies = () => {
    axios.get(`https://api.tvmaze.com/search/shows?q=${query}`)
      .then(response => setResults(response.data))
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for movies..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchMovies}
      />
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.show.id}
            onPress={() => navigation.navigate('Details', { movie: item.show })}
            style={styles.movieContainer}
          >
            <Image source={{ uri: item.show.image?.medium }} style={styles.thumbnail} />
            <Text style={styles.movieTitle}>{item.show.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.show.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

// Splash Screen
const SplashScreen = ({ navigation }) => {
  React.useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2000); // Navigate to Home after 2 seconds
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.title}>Welcome to MovieApp</Text>
      <StatusBar style="auto" />
    </View>
  );
};

// Tab Navigator with icons
const HomeTab = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'white', // Active icon color
      tabBarInactiveTintColor: 'gray', // Inactive icon color
      tabBarStyle: {
        backgroundColor: '#000', // Tab bar background color
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Main Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeTab} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    width: '90%',
    borderRadius: 5,
  },
  movieContainer: {
    marginRight: 10,
    width: 120,
    alignItems: 'center',
  },
  flatListContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  summary: {
    color: '#fff',
    padding: 10,
  },
});
