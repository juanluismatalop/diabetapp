import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, Image, Modal, ActivityIndicator, StyleSheet
} from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export default function Login({ loginExitoso }: { loginExitoso: () => void }) {
  const [usuario, setUsuario] = useState('');
  const [contrasenna, setContrasenna] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasenna, setNuevaContrasenna] = useState('');
  const [loading, setLoading] = useState(false);

  const procesarLogin = async () => {
    if (!usuario || !contrasenna) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, usuario, contrasenna);
      loginExitoso();
    } catch (error: any) {
      let msg = "Error al iniciar sesión";
      if (error.code === 'auth/invalid-email') msg = "Email inválido";
      else if (error.code === 'auth/user-not-found') msg = "Usuario no encontrado";
      else if (error.code === 'auth/wrong-password') msg = "Contraseña incorrecta";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const procesarRegistro = async () => {
    if (!nuevoUsuario || !nuevaContrasenna) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (nuevaContrasenna.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, nuevoUsuario, nuevaContrasenna);
      Alert.alert("Éxito", "Usuario registrado");
      setModalVisible(false);
      setNuevoUsuario('');
      setNuevaContrasenna('');
    } catch (error: any) {
      let msg = "No se pudo registrar";
      if (error.code === 'auth/email-already-in-use') msg = "El email ya está en uso";
      else if (error.code === 'auth/invalid-email') msg = "Email inválido";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#45a0cc" />
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={require("../../Components/pictures/diabetapp.png")} style={styles.logo} />
        </View>

        <TextInput
          placeholder="Correo electrónico"
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Contraseña"
          value={contrasenna}
          onChangeText={setContrasenna}
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={procesarLogin} style={styles.boton}>
          <Text style={styles.botonTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.boton, styles.botonSecundario]}>
          <Text style={styles.botonTexto}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.tituloModal}>Registrar nuevo usuario</Text>
            <TextInput
              placeholder="Correo electrónico"
              value={nuevoUsuario}
              onChangeText={setNuevoUsuario}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Contraseña"
              value={nuevaContrasenna}
              onChangeText={setNuevaContrasenna}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={procesarRegistro} style={styles.boton}>
              <Text style={styles.botonTexto}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.boton, styles.botonCancelar]}>
              <Text style={styles.botonTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#b5c9f5' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 150, height: 150 },
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
  botonSecundario: { backgroundColor: "#58b4e1" },
  botonCancelar: { backgroundColor: "#e74c3c" },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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