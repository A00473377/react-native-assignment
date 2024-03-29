//The home screen of the app where users will see temperature based on their location tracked
import { View, Text, StyleSheet } from 'react-native';
import Weather from "../components/Weather";
import { useEffect, useState } from "react";
import { API_KEY } from "../utils/WeatherAPIKey";
import * as Location from "expo-location";



const HomeScreen = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    
    const [weatherData, setWeatherData] = useState({
        temperature: 0,
        locationName: "",
        weatherCondition: "",
        conditionIcon: "",
    });
    
    const fetchWeather = (latitude = 25, longitude = 25) => {
        fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
        )
          .then((res) => res.json())
          .then((json) => {
            setWeatherData({
              temperature: json.main.temp,
              locationName: json.name,
              weatherCondition: json.weather[0].main,
              conditionIcon: json.weather[0].icon,
            });
            setIsLoading(false);
          })
          .catch((err) => {
            setError(true);
          });
    };
    useEffect(() => {
        /// Wrapped with an async scope because we're using await in useEffect
        (async () => {
          setIsLoading(true);
    
          // Get Permission
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setError("Permission to access location was denied");
            return;
          }
    
          // Get location (if permission granted)
          let location = await Location.getCurrentPositionAsync({});
    
          // Fetch Weather data from location's latitude and longitude
          fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, []);  
    return (
        <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Fetching the weather data...</Text>
      ) : (
        <Weather weatherData={weatherData} />
      )}
      {error && <Text style={{ color: "red" }}>An error has occurred!</Text>}
    </View>
    );
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        width: "100%"
    },
    textdisplay:{
        fontSize: 40
    },
    loadingText: {
        color: "black",
    }
  });