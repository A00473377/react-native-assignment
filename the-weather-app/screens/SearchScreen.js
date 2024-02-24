//The screen where user can enter the location and search for the location they want to see the weather from and also can save the location 
import { View, Text, StyleSheet } from 'react-native';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style = {styles.textdisplay}>Search Screen</Text>
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
        fontSize: 40
    }
  });