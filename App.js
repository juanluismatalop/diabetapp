import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import Home from './Components/homepage/home';
import Login from './Components/login/login';
import { DatosProvider } from './Components/homepage/components/datosContext';

export default function App() {
  const [pantallaActual, setPantallaActual] = useState('login');
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  const loginExitoso = () => {
    setUsuarioAutenticado(true);
    setPantallaActual('home');
  };

  const cerrarSesion = () => {
    setUsuarioAutenticado(false);
    setPantallaActual('login');
  };
  function pantalla(){
  switch (pantallaActual) {
    case 'login':
      return <Login loginExitoso={loginExitoso}/>;
    case 'home':
      return <Home cerrarSesion={cerrarSesion}/>;
  }
}
  return (
    <DatosProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {pantalla()}
      </View>
    </DatosProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#b5c9f5',
    alignItems: 'center',
    justifyContent: 'center',
    margin:0.1,
  },
  home:{
    
    margin:0,
  }
});
