import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('zaid.db');

const CityList = () => {
  const [cities, setCities] = useState([]);

  // Function to refresh the city list
  const refresh = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM cities',
          [],
          (_, { rows }) => {
            const citiesArray = rows._array;
            setCities(citiesArray);
          },
          (_, error) => {
            console.log('Error fetching cities:', error);
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
      }
    );
  };

  // Function to delete a city
  const deleteCity = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM cities WHERE id = ?',
          [id],
          () => {
            console.log('City deleted successfully');
            refresh(); // Refresh the city list after deletion
          },
          (_, error) => {
            console.log('Error deleting city:', error);
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
      }
    );
  };

  useEffect(() => {
    // Call the refresh function when the component mounts
    refresh();

    // Clean-up function to close database connection when component unmounts
    return () => {
      db._db.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={refresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>List of Cities:</Text>
      {cities.map((city) => (
        <View key={city.id} style={styles.cityContainer}>
          <Text>Name: {city.name}</Text>
          <Text>Temperature: {city.temperature}</Text>
          <TouchableOpacity onPress={() => deleteCity(city.id)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  refreshButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cityContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default CityList;
