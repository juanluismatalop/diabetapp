import React, { useContext, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
// Componentes
import MisDatos from './components/misDatos';
import Calculadora from './components/calculadora';
import Notas from './components/notas';
import Ajustes from './components/ajustes';
import RecordatorioLenta from './components/recordatorioLenta';
import ModoMonitor from './components/modoMonitor';
import { DatosContext } from './components/datosContext';

export default function Home({ cerrarSesion }: { cerrarSesion: () => void }) {
  const datosContext = useContext(DatosContext);
  
  if (!datosContext) {
    throw new Error("Home debe estar dentro de DatosProvider");
  }

  const { 
    modoMonitor, 
    ratioMannana, 
    ratioMediodia, 
    ratioTarde, 
    ratioNoche, 
    usuario1 
  } = datosContext;

  const [pantalla, setPantalla] = useState('notas');
  
  console.log(ratioMannana, ratioMediodia, ratioTarde, ratioNoche);

  function activadoModoMonitor() {
    if (modoMonitor !== false) {
      return (
        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('monitor')}>
          <Image
            source={require('../../Components/pictures/png-trmonitor.png')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  function cambiarFragmento() {
    switch (pantalla) {
      case 'calculadora':
        return <Calculadora />;
      case 'misDatos':
        return <MisDatos />;
      case 'notas':
        return <Notas />;
      case 'monitor':
        return <ModoMonitor />;
      case 'ajustes':
        return <Ajustes />;
      case 'lenta':
        return <RecordatorioLenta />;
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
      
      <Text style={styles.bienvenido}>Bienvenido {usuario1}</Text>

      <View style={styles.content}>{cambiarFragmento()}</View>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('ajustes')}>
          <Image
            source={require('../../Components/pictures/ajustes.webp')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>

        {activadoModoMonitor()}
        
        <TouchableOpacity style={styles.navButton} onPress={() => setPantalla('lenta')}>
          <Image
            source={require('../../Components/pictures/17701.png')}
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
  bienvenido: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4A90E2', 
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'System', 
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});