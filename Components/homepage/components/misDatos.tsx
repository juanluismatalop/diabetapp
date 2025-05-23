import { useContext, useState } from "react";
import { TextInput, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DatosContext } from "./datosContext";

export default function MisDatos() {
  const {
    setRatioMannana,
    setRatioMediodia,
    setRatioTarde,
    setRatioNoche,
    setFactorSensibilidad,
    ratioMannana,
    ratioMediodia,
    ratioTarde,
    ratioNoche,
    factorSensibilidad
  } = useContext(DatosContext);

  // Inicializo con valores actuales del contexto para mostrar datos guardados
  const [mannana, setMananna] = useState(ratioMannana.toString());
  const [mediodia, setMediodia] = useState(ratioMediodia.toString());
  const [tarde, setTarde] = useState(ratioTarde.toString());
  const [noche, setNoche] = useState(ratioNoche.toString());
  const [ff, setFf] = useState(factorSensibilidad.toString());

  function Guardar() {
    setRatioMannana(parseFloat(mannana) || 0);
    setRatioMediodia(parseFloat(mediodia) || 0);
    setRatioTarde(parseFloat(tarde) || 0);
    setRatioNoche(parseFloat(noche) || 0);
    setFactorSensibilidad(parseFloat(ff) || 0);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputtext}>
        <Text>Ratio de la mañana:</Text>
        <TextInput
          value={mannana}
          onChangeText={setMananna}
          keyboardType="numeric"
          style={styles.styleInput}
        />
      </View>
      <View style={styles.inputtext}>
        <Text>Ratio del mediodía:</Text>
        <TextInput
          value={mediodia}
          onChangeText={setMediodia}
          keyboardType="numeric"
          style={styles.styleInput}
        />
      </View>
      <View style={styles.inputtext}>
        <Text>Ratio de la tarde:</Text>
        <TextInput
          value={tarde}
          onChangeText={setTarde}
          keyboardType="numeric"
          style={styles.styleInput}
        />
      </View>
      <View style={styles.inputtext}>
        <Text>Ratio de la noche:</Text>
        <TextInput
          value={noche}
          onChangeText={setNoche}
          keyboardType="numeric"
          style={styles.styleInput}
        />
      </View>
      <View style={styles.inputtext}>
        <Text>Factor de sensibilidad:</Text>
        <TextInput
          value={ff}
          onChangeText={setFf}
          keyboardType="numeric"
          style={styles.styleInput}
        />
      </View>
      <TouchableOpacity style={styles.botonExterior} onPress={Guardar}>
        <Text style={styles.botonInterior}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  botonInterior: {
    height: 50,
    backgroundColor: "#45a0cc",
    color: "white",
    textAlign: "center",
    lineHeight: 50,
    borderRadius: 80,
    width: 150,
  },
  botonExterior: { marginTop: 20 },
  inputtext: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 10,
  },
  styleInput: {
    borderColor: "#45a0cc",
    borderWidth: 2,
    borderRadius: 80,
    textAlign: "center",
    width: 100,
    backgroundColor: "white",
  },
});
