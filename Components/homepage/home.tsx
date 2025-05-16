import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MisDatos from './components/misDatos';

export default function Home() {
  return (
   <View>
    <View style={styles.imagenlogo}>
      <Image source={require('../../Components/pictures/diabetapp.png')}
        resizeMode="contain"
        style={styles.logo}/>
    </View>
    <View style={styles.components}>
      <MisDatos></MisDatos>
    </View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.componentenavbar}>
          <Image source={require('../../Components/pictures/ajustes.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar}>
          <Image source={require('../../Components/pictures/calculadora.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar}>
            <Image source={require('../../Components/pictures/misdatos.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar}>
            <Image source={require('../../Components/pictures/notas.png')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar}>
          <Image source={require('../../Components/pictures/cerrarsesion.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
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
    botones:{
      width: 50,
      height: 50,
    },
    components:{
      width: "100%",
      marginBottom: 20,
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',          
      padding: 10,
    },
    componentenavbar:{
      marginLeft: 20
    },
    imagenlogo:{
      alignItems: 'center'
    }
  })
