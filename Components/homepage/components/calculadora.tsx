import { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { DatosContext } from "./datosContext";

export default function Calculadora() {
  const {
    ratioMannana,
    ratioMediodia,
    ratioTarde,
    ratioNoche,
    factorSensibilidad,
  } = useContext(DatosContext);

  const [raciones, setRaciones] = useState("");
  const [glucosa, setGlucosa] = useState("");
  const [insulina, setInsulina] = useState(null);
  const [espera, setEspera] = useState(null);

  const hora = new Date().getHours();

  function calculoDInsulina() {
    const r = parseFloat(raciones) || 0;
    const g = parseFloat(glucosa) || 0;
    let correccion = 0;
    if (g > 150 && factorSensibilidad) {
      correccion = (g - 100) / factorSensibilidad;
    }

    let dosis = 0;
    if (hora >= 5 && hora < 13) {
      dosis = ratioMannana * r + correccion;
    } else if (hora >= 13 && hora < 17) {
      dosis = ratioMediodia * r + correccion;
    } else if (hora >= 17 && hora < 20) {
      dosis = ratioTarde * r + correccion;
    } else if (hora >= 20 && hora < 24) {
      dosis = ratioNoche * r + correccion;
    } else {
      dosis = ratioTarde * r + correccion;
    }

    setInsulina(Math.round(dosis));
    setEspera(Math.floor(g / 10));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text>Glucosa</Text>
          <TextInput
            style={styles.input}
            onChangeText={setGlucosa}
            keyboardType="numeric"
            value={glucosa}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Raciones</Text>
          <TextInput
            style={styles.input}
            onChangeText={setRaciones}
            keyboardType="numeric"
            value={raciones}
          />
        </View>
      </View>

      <View style={styles.resultados}>
        <Text style={styles.resultText}>Insulina que poner:</Text>
        <Text style={styles.resultValue}>{insulina !== null ? insulina : "-"}</Text>

        <Text style={styles.resultText}>Tiempo de Espera:</Text>
        <Text style={styles.resultValue}>{espera !== null ? espera : "-"}</Text>
      </View>

      <TouchableOpacity style={styles.botonExterior} onPress={calculoDInsulina}>
        <Text style={styles.botonInterior}>Calcular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  inputContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#45a0cc",
    borderRadius: 25,
    padding: 10,
    marginHorizontal: 5,
  },
  input: {
    borderColor: "#45a0cc",
    borderWidth: 1,
    borderRadius: 20,
    width: 60,
    padding: 5,
    marginLeft: 10,
    textAlign: "center",
  },
  resultados: {
    backgroundColor: "white",
    borderColor: "#45a0cc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: 200,
    alignItems: "center",
    marginBottom: 20,
  },
  resultText: { fontWeight: "bold", fontSize: 16 },
  resultValue: { fontSize: 24, marginBottom: 10 },
  botonInterior: {
    height: 50,
    backgroundColor: "#45a0cc",
    color: "white",
    textAlign: "center",
    lineHeight: 50,
    borderRadius: 80,
    width: 150,
  },
  botonExterior: {},
});
