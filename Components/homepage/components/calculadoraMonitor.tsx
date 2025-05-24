import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { DatosContext } from "./datosContext";

export default function CalculadoraMonitor() {
  const { ninnos, factorSensibilidad } = useContext(DatosContext);

  const [raciones, setRaciones] = useState(""); // Común para todos
  const [glucosaPorNino, setGlucosaPorNino] = useState({}); // Glucosa individual
  const [insulinaPorNino, setInsulinaPorNino] = useState({});

  const hora = new Date().getHours();

  const calcularInsulina = () => {
    const r = parseFloat(raciones) || 0;
    let nuevasInsulinas = {};

    ninnos.forEach((nino, index) => {
      const g = parseFloat(glucosaPorNino[index]) || 0;
      let correccion = 0;

      if (g > 150 && factorSensibilidad) {
        correccion = (g - 100) / factorSensibilidad;
      }

      let ratio = 0;
      if (hora >= 5 && hora < 13) ratio = nino.ratioManana;
      else if (hora >= 13 && hora < 17) ratio = nino.ratioMediodia;
      else if (hora >= 17 && hora < 20) ratio = nino.ratioTarde;
      else if (hora >= 20 && hora < 24) ratio = nino.ratioNoche;
      else ratio = nino.ratioTarde;

      const dosis = ratio * r + correccion;
      nuevasInsulinas[index] = Math.round(dosis);
    });

    setInsulinaPorNino(nuevasInsulinas);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Raciones (comunes):</Text>
      <TextInput
        style={styles.inputGlobal}
        keyboardType="numeric"
        value={raciones}
        onChangeText={(text) => setRaciones(text.replace(/[^0-9.]/g, ""))}
        placeholder="Raciones"
      />

      {ninnos.map((nino, index) => (
        <View key={index} style={styles.tarjeta}>
          <Text style={styles.nombre}>{nino.nombre}</Text>

          <Text style={styles.label}>Glucosa:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={glucosaPorNino[index]?.toString() || ""}
            onChangeText={(text) =>
              setGlucosaPorNino((prev) => ({
                ...prev,
                [index]: text.replace(/[^0-9.]/g, ""),
              }))
            }
            placeholder="mg/dL"
          />

          <View style={styles.fila}>
            <Text style={styles.label}>Insulina a poner:</Text>
            <Text style={styles.insulina}>
              {insulinaPorNino[index] !== undefined
                ? insulinaPorNino[index]
                : "-"}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.boton} onPress={calcularInsulina}>
        <Text style={styles.botonTexto}>Calcular</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  inputGlobal: {
    borderWidth: 1,
    borderColor: "#45a0cc",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  tarjeta: {
    backgroundColor: "#e0f0fb",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  nombre: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#45a0cc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    textAlign: "center",
    marginBottom: 10,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insulina: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#045d9c",
  },
  boton: {
    backgroundColor: "#45a0cc",
    borderRadius: 80,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignSelf: "center",
    marginTop: 10,
  },
  botonTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
