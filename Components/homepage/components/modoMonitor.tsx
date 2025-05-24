import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import AnnadirPersona from "./annadirPersona";
import CalculadoraMonitor from "./calculadoraMonitor";

export default function ModoMonitor() {
  const [pantalla, setPantalla] = useState("");

  function renderPantalla() {
    switch (pantalla) {
      case "annadirNinno":
        return <AnnadirPersona />;
      case "calculadoraNinnos":
        return <CalculadoraMonitor />;
      default:
        return (
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setPantalla("annadirNinno")}
            >
              <Text style={styles.buttonText}>Añadir Niños</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setPantalla("calculadoraNinnos")}
            >
              <Text style={styles.buttonText}>Cálculos de los Niños</Text>
            </TouchableOpacity>
          </View>
        );
    }
  }

  return (
    <View style={styles.container}>
      {pantalla !== "" && (
        <TouchableOpacity style={styles.backButton} onPress={() => setPantalla("")}>
          <Text style={styles.backButtonText}>⬅ Volver</Text>
        </TouchableOpacity>
      )}
      {renderPantalla()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa todo el espacio del padre (content en Home)
    padding: 10,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#45a0cc",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 80,
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#45a0cc",
    fontSize: 16,
  },
});
