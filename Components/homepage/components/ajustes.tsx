import React, { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet, TextInput } from "react-native";
import { DatosContext } from "./datosContext";

export default function Ajustes() {
  const { modoMonitor, setModoMonitor, maximaRatio, setMaximaRatio } = useContext(DatosContext);

  function activarMonitor() {
    setModoMonitor(!modoMonitor);
  }

  function renderBoton() {
    return (
      <View style={styles.contenido}>
        <TouchableOpacity onPress={activarMonitor} style={styles.botonExterior}>
          <Text style={styles.botonInterior}>
            {modoMonitor ? "Deshabilitar Modo Monitor" : "Habilitar Modo Monitor"}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Máximo de Ratio</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(maximaRatio)}
            onChangeText={(text) => setMaximaRatio(text)}
            placeholder="Ej: 1.5"
            placeholderTextColor="#aaa"
          />
        </View>
      </View>
    );
  }

  return <View style={styles.container}>{renderBoton()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  contenido: {
    width: "100%",
    alignItems: "center",
  },
  botonInterior: {
    height: 50,
    backgroundColor: "#45a0cc",
    color: "white",
    textAlign: "center",
    lineHeight: 50,
    borderRadius: 80,
    width: 250,
    fontWeight: "bold",
    fontSize: 16,
  },
  botonExterior: {
    borderRadius: 80,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 30,
  },
  inputGroup: {
    width: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
});
