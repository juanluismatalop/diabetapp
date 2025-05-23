import { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
WebBrowser.maybeCompleteAuthSession();

export default function Login({ loginExitoso }: { loginExitoso: () => void }) {
  const [usuario, setUsuario] = useState('');
  const [contrasenna, setContrasenna] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevaContrasenna, setNuevaContrasenna] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '944537282741-009p5g1pp2dof0noeo2u09a3gsabussj.apps.googleusercontent.com', 
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
        if (idToken) {
            const credential = GoogleAuthProvider.credential(idToken);
            signInWithCredential(auth, credential)
            .then(() => loginExitoso())
            .catch(() => Alert.alert("Error", "Error al iniciar sesión con Google"));
        } else {
            Alert.alert("Error", "No se pudo obtener el token de Google");
        }
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => loginExitoso())
        .catch(() => Alert.alert("Error", "Error al iniciar sesión con Google"));
    }
  }, [response]);

  async function procesarLogin() {
    try {
      await signInWithEmailAndPassword(auth, usuario, contrasenna);
      loginExitoso();
    } catch {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  }

  async function procesarRegistro() {
    try {
      await createUserWithEmailAndPassword(auth, nuevoUsuario, nuevaContrasenna);
      Alert.alert("Éxito", "Usuario registrado");
      setModalVisible(false);
    } catch {
      Alert.alert("Error", "No se pudo registrar");
    }
  }

  function iniciarConGoogle() {
    promptAsync();
  }

  return (
    <View style={styles.container}>
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
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={contrasenna}
          onChangeText={setContrasenna}
          secureTextEntry
        />

        <TouchableOpacity onPress={procesarLogin} style={styles.boton}>
          <Text style={styles.botonTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.boton, styles.botonSecundario]}>
          <Text style={styles.botonTexto}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={iniciarConGoogle} style={styles.botonGoogle}>
          <Image
            source={require("../../Components/pictures/Google2016Circle.webp")}
            style={styles.logoGoogle}
          />
          <Text style={styles.botonTextoGoogle}>Iniciar con Google</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.tituloModal}>Registrar nuevo usuario</Text>
            <TextInput
              placeholder="Correo"
              value={nuevoUsuario}
              onChangeText={setNuevoUsuario}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Contraseña"
              value={nuevaContrasenna}
              onChangeText={setNuevaContrasenna}
              style={styles.input}
              secureTextEntry
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
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  imagenlogo: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formulario: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
  },
  boton: {
    backgroundColor: "#45a0cc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  botonSecundario: {
    backgroundColor: "#58b4e1",
  },
  botonCancelar: {
    backgroundColor: "#bbb",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  botonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
  },
  logoGoogle: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  botonTextoGoogle: {
    color: "#333",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 320,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
