import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { API_KEY } from "../utils/WeatherAPIKey";
import Weather from "../components/Weather";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('zaid.db');

const SearchScreen = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [city,setCity] = useState();
  const [lat,setLat] = useState(0);
  const [long,setLong] = useState(0);
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    locationName: "",
    weatherCondition: "",
    conditionIcon: "",
  });

  const createCitiesTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, temperature TEXT)'
        );
    });
  };

  createCitiesTable();

  function fetchWeatherData(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`)
      .then(res => res.json())
      .then(result => {
        const lat = result[0].lat;
        const lon = result[0].lon;
        setLat(result[0].lat);
        setLong(result[0].lon);
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`)
          .then(res => res.json())
          .then(weatherResult => {
            setWeatherData({
              temperature: weatherResult.main.temp,
              locationName: weatherResult.name,
              weatherCondition: weatherResult.weather[0].main,
              conditionIcon: weatherResult.weather[0].icon,
            });
            setIsLoading(false);
          })
          .catch(error => {
            console.error('There was an error fetching the weather data:', error);
          });
      })
      .catch(error => {
        console.error('There was an error fetching the location data:', error);
      });
  }

  const handleSaveCity = (city, temperature) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO cities (name, temperature) VALUES (?, ?)',
          [city, temperature],
          (_, results) => {
            console.log('City saved successfully');
          },
          (_, error) => {
            console.log('Error saving city:', error);
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          onChangeText={(text) => setCity(text)}
          value={city}
        />
        <Button title="Search" onPress={() => fetchWeatherData(city)} />
      </View>
      <View style={styles.weatherContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Waiting for the city</Text>
        ) : (
          <View>
            <View style={styles.headerContainer}>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${weatherData.conditionIcon}@2x.png`,
                }}
                style={styles.weatherIcon}
              />
              <Text style={styles.tempText}>{weatherData.locationName}</Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.temperature}>{weatherData.temperature}˚</Text>
              <Text style={styles.weatherCondition}>{weatherData.weatherCondition}</Text>
            </View>
            <Button title="SAVE CITY" onPress={() => handleSaveCity(city, weatherData.temperature)} />
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '70%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  weatherContainer: {
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  tempText: {
    fontSize: 24,
    marginLeft: 10,
  },
  bodyContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 24,
  },
  weatherCondition: {
    fontSize: 18,
  },
  loadingText: {
    fontSize: 18,
  },
});
