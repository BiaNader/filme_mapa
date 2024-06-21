import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = 'cc05c636'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Busca de Filmes</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        placeholderTextColor="#aaa"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Filme" onPress={handleSearch} color="#4C306F" />

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Sua Localização</Text>
          <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}

      {movieData && (
        <View style={styles.movieContainer}>
          <Text style={styles.movieTitle}>{movieData.Title}</Text>
          <Text style={styles.movieText}>Ano: {movieData.Year}</Text>
          <Text style={styles.movieText}>Gênero: {movieData.Genre}</Text>
          <Text style={styles.movieText}>Diretor: {movieData.Director}</Text>
          <Text style={styles.movieText}>Prêmios: {movieData.Awards}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#F8F8F8',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4C306F',
    padding: 10,
    marginBottom: 10,
    color: '#F8F8F8',
    borderRadius: 5,
  },
  locationContainer: {
    marginVertical: 20,
  },
  locationTitle: {
    fontSize: 18,
    color: '#F8F8F8',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#AFAFAF',
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  movieContainer: {
    marginVertical: 20,
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 5,
  },
  movieTitle: {
    fontSize: 18,
    color: '#F8F8F8',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movieText: {
    fontSize: 16,
    color: '#AFAFAF',
  },
});

export default App;
