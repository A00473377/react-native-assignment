//The screen where user can enter the location and search for the location they want to see the weather from and also can save the location 
// import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";
import { View, Text, TextInput, Button,StyleSheet } from 'react-native';
import { API_KEY } from "../utils/WeatherAPIKey";
import Weather from "../components/Weather";


const SearchScreen = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);


  //logic for implementing after search. Making it Async for handling data
  const handleSearch = async () => {
    try {
      setSelectedCity(searchQuery);
      const locationData = await fetchLocation(searchQuery);
    } catch (error) {
      setError('Error fetching data');
      console.error('Error:', error);
    }
  };

  //To get latitude and longitude via API using the entered City as input.
  const fetchLocation = async (cityName) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log('datacheclk: ',json,json.lat);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };

  return (
    <View style={{ padding: 20 }}>
    <View style={{ marginBottom: 20 }}>
      <TextInput
        style={styles.searchText}
        placeholder="Enter city name"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
    </View>
    <View style={{ marginBottom: 20 }}>
      <Button title="Search" onPress={handleSearch} />
    </View>
    {/* {selectedCity ? <Text style={styles.fontSize}>You entered: {selectedCity}</Text> : <Text style={styles.fontSize}>Incorrect City Name</Text>} */}
    {<Text>{selectedCity}</Text>}
  </View>
  );
}

export default SearchScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textdisplay:{
        fontSize: 24
    },
    searchText:{ 
      height: 40, 
      borderColor: 'gray', 
      borderWidth: 1, 
      paddingHorizontal: 10 }
  });