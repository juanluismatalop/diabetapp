import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Home from './Components/homepage/home';
import { DatosProvider } from './Components/homepage/components/datosContext';

export default function App() {
  return (
    <View
      style={styles.container}>
        <StatusBar style="auto" />
        <DatosProvider>
          <Home />
        </DatosProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
