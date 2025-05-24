import React, { useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { DatosContext } from "./datosContext";

export default function Ajustes() {
  const { modoMonitor, setModoMonitor } = useContext(DatosContext);

  function activarMonitor() {
    setModoMonitor(!modoMonitor);
  }

  function renderBoton() {
    return (
      <TouchableOpacity onPress={activarMonitor} style={styles.botonExterior}>
        <Text style={styles.botonInterior}>
          {modoMonitor ? "Deshabilitar Modo Monitor" : "Habilitar Modo Monitor"}
        </Text>
      </TouchableOpacity>
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
  },
  botonInterior: {
    height: 50,
    backgroundColor: "#45a0cc",
    color: "white",
    textAlign: "center",
    lineHeight: 50,
    borderRadius: 80,
    width: 200,
    fontWeight: "bold",
  },
  botonExterior: {
    borderRadius: 80,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
});
