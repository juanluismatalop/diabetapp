import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
// Componentes
import MisDatos from './components/misDatos';
import Calculadora from './components/calculadora';
import Notas from './components/notas';
import Ajustes from './components/ajustes';

export default function Home({ cerrarSesion }: { cerrarSesion: () => void }) {
  const [pantalla, setPantalla] = useState('notas');

  function cambiarFragmento() {
    switch (pantalla) {
      case 'calculadora':
        return <Calculadora />;
      case 'misDatos':
        return <MisDatos />;
      case 'notas':
        return <Notas />;
      case 'ajustes':
        return <Ajustes />;
      default:
        return <Notas />;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagenlogo}>
        <Image
          source={require('../../Components/pictures/diabetapp.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <View style={styles.content}>{cambiarFragmento()}</View>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('ajustes')}>
          <Image
            source={require('../../Components/pictures/ajustes.webp')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('calculadora')}>
          <Image
            source={require('../../Components/pictures/calculadora.webp')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('misDatos')}>
          <Image
            source={require('../../Components/pictures/misdatos.webp')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('notas')}>
          <Image
            source={require('../../Components/pictures/notas.png')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={cerrarSesion}>
          <Image
            source={require('../../Components/pictures/cerrarsesion.webp')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagenlogo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  navButton: {
    paddingHorizontal: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
