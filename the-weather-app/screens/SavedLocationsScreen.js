//The screen where user can see the list of all the locations they have saved
import { View, Text,StyleSheet } from 'react-native';

const SavedLocationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style = {styles.textdisplay}> Saved Location Screen</Text>
    </View>
  );
}

export default SavedLocationScreen;

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