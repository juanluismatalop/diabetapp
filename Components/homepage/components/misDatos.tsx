import { useContext, useState } from "react";
import { TextInput, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { DatosContext } from "./datosContext";

export default function MisDatos({ cambiarPantalla }: { cambiarPantalla: (pantalla: string) => void }) {
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
    factorSensibilidad,
    maximaRatio,
  } = useContext(DatosContext);

  const [mannana, setMananna] = useState(ratioMannana.toString());
  const [mediodia, setMediodia] = useState(ratioMediodia.toString());
  const [tarde, setTarde] = useState(ratioTarde.toString());
  const [noche, setNoche] = useState(ratioNoche.toString());
  const [ff, setFf] = useState(factorSensibilidad.toString());

  function Guardar() {
    const ratios = [
      { nombre: "mañana", valor: parseFloat(mannana) || 0 },
      { nombre: "mediodía", valor: parseFloat(mediodia) || 0 },
      { nombre: "tarde", valor: parseFloat(tarde) || 0 },
      { nombre: "noche", valor: parseFloat(noche) || 0 },
    ];

    const fueraDeRango = ratios.find((r) => r.valor > maximaRatio);

    if (fueraDeRango) {
      Alert.alert(
        "Error de Ratio",
        `La ratio de la ${fueraDeRango.nombre} (${fueraDeRango.valor}) supera la máxima permitida de ${maximaRatio}`,
        [{ text: "OK" }]
      );
      setMananna("0");
      setMediodia("0");
      setTarde("0");
      setNoche("0");
      setFf("0");
      return;
    }

    setRatioMannana(ratios[0].valor);
    setRatioMediodia(ratios[1].valor);
    setRatioTarde(ratios[2].valor);
    setRatioNoche(ratios[3].valor);
    setFactorSensibilidad(parseFloat(ff) || 0);

    cambiarPantalla('calculadora');
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
          maxLength={3}
        />
      </View>
      <View style={styles.inputtext}>
        <Text>Ratio del mediodía:</Text>
        <TextInput
          value={mediodia}
          onChangeText={setMediodia}
          keyboardType="numeric"
          style={styles.styleInput}
          maxLength={3}
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
