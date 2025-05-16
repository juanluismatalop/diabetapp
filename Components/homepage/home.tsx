import React from 'react';
import { View, Image, StyleSheet} from 'react-native';
import MisDatos from './components/misDatos';

export default function Home() {
  const logo = `Components\pictures\diabetapp.png`
  return (
   <View>
    <View>
      <Image source={require('../../Components/pictures/diabetapp.png')}
        resizeMode="contain"
        style={styles.logo}/>
    </View>
    <View style={styles.components}>
      <MisDatos></MisDatos>
    </View>
    <View>
      
    </View>
    </View>
  );
  
}
const styles = StyleSheet.create({
    logo:{
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    components:{
      width: "100%",
      marginBottom: 20,
    }
  })
