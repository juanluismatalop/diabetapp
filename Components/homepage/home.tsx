import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
//coomponentes
import MisDatos from './components/misDatos';
import Calculadora from './components/calculadora';
import Notas from './components/notas';
import Ajustes from './components/ajustes';

export default function Home({cerrarSesion}: { cerrarSesion: () => void }) {
  const[pantalla, setPantalla] = useState('notas');
  function cambiarFragmento(){
    switch(pantalla){
      case 'calculadora':
        return <Calculadora></Calculadora>;
      case 'misDatos':
        return <MisDatos></MisDatos>;
      case 'notas':
        return <Notas></Notas>
      case 'ajustes':
        return <Ajustes/>
    }
  }
  return (
   <View>
    <View style={styles.imagenlogo}>
      <Image source={require('../../Components/pictures/diabetapp.png')}
        resizeMode="contain"
        style={styles.logo}/>
    </View>
    <View style={styles.components}>
      {cambiarFragmento()}
    </View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.componentenavbar} onPress={()=>setPantalla('ajustes')}>
          <Image source={require('../../Components/pictures/ajustes.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar} onPress={()=>setPantalla('calculadora')}>
          <Image source={require('../../Components/pictures/calculadora.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar} onPress={()=>setPantalla('misDatos')}>
            <Image source={require('../../Components/pictures/misdatos.webp')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar} onPress={()=>setPantalla('notas')}>
            <Image source={require('../../Components/pictures/notas.png')}
              resizeMode="contain"
              style={styles.botones}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.componentenavbar} onPress={cerrarSesion}>
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
      borderWidth:2,
      borderColor: 'black',
      borderRadius: 60,
      borderBottomColor: 'white',
      backgroundColor:'white'
    },
    componentenavbar:{
      marginLeft: 20
    },
    imagenlogo:{
      alignItems: 'center'
    }
  })
