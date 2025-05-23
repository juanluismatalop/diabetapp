import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configura Google Sign-In
GoogleSignin.configure({
  webClientId: '944537282741-009p5g1pp2dof0noeo2u09a3gsabussj.apps.googleusercontent.com',
  offlineAccess: false,
});

export default function Login({ loginExitoso }: { loginExitoso: () => void }) {
  const [usuario, setUsuario] = useState('');
  const [contrasenna, setContrasenna] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasenna, setNuevaContrasenna] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error("No se pudo obtener el ID Token de Google");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      loginExitoso();
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Error", error.message || "Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  async function procesarLogin() {
    if (!usuario || !contrasenna) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, usuario, contrasenna);
      loginExitoso();
    } catch (error: any) {
      let errorMessage = "Usuario o contraseña incorrectos";
      if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuario no encontrado";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Contraseña incorrecta";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function procesarRegistro() {
    if (!nuevoUsuario || !nuevaContrasenna) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (nuevaContrasenna.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, nuevoUsuario, nuevaContrasenna);
      Alert.alert("Éxito", "Usuario registrado correctamente");
      setModalVisible(false);
      setNuevoUsuario('');
      setNuevaContrasenna('');
    } catch (error: any) {
      let errorMessage = "No se pudo registrar";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "El email ya está registrado";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#45a0cc" />
        </View>
      )}

      <View style={styles.imagenlogo}>
        <Image
          source={require("../../Components/pictures/diabetapp.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <View style={styles.formulario}>
        <Text style={styles.titulo}>Iniciar Sesión</Text>
        
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={contrasenna}
          onChangeText={setContrasenna}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity 
          onPress={procesarLogin} 
          style={styles.boton}
          disabled={loading}
        >
          <Text style={styles.botonTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
          style={[styles.boton, styles.botonSecundario]}
          disabled={loading}
        >
          <Text style={styles.botonTexto}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={signInWithGoogle} 
          style={styles.botonGoogle}
          disabled={loading}
        >
          <Image
            source={require("../../Components/pictures/Google2016Circle.png")}
            style={styles.logoGoogle}
          />
          <Text style={styles.botonTextoGoogle}>Iniciar con Google</Text>
        </TouchableOpacity>
      </View>

      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.tituloModal}>Registrar nuevo usuario</Text>
            
            <TextInput
              placeholder="Correo electrónico"
              value={nuevoUsuario}
              onChangeText={setNuevoUsuario}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
            
            <TextInput
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={nuevaContrasenna}
              onChangeText={setNuevaContrasenna}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity 
              onPress={procesarRegistro} 
              style={styles.boton}
              disabled={loading}
            >
              <Text style={styles.botonTexto}>Registrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={[styles.boton, styles.botonCancelar]}
              disabled={loading}
            >
              <Text style={styles.botonTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imagenlogo: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  formulario: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: '#333',
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#45a0cc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  botonSecundario: {
    backgroundColor: "#58b4e1",
  },
  botonCancelar: {
    backgroundColor: "#e74c3c",
    marginTop: 5,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 15,
  },
  logoGoogle: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  botonTextoGoogle: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#333',
  },
});