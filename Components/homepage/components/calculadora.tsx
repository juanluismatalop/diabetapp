import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DatosContext } from "./datosContext";

export default function Calculadora() {
  const {
    ratioMannana,
    ratioMediodia,
    ratioTarde,
    ratioNoche,
    factorSensibilidad,
    empezarCorregir,
    setEmpezarCorregir,
  } = useContext(DatosContext);

  const [raciones, setRaciones] = useState("");
  const [glucosa, setGlucosa] = useState("");
  const [insulina, setInsulina] = useState(null);
  const [espera, setEspera] = useState(null);
  const [nuevoUmbral, setNuevoUmbral] = useState(empezarCorregir.toString());

  const hora = new Date().getHours();

  function calculoDInsulina() {
    const r = parseFloat(raciones) || 0;
    const g = parseFloat(glucosa) || 0;
    let correccion = 0;

    if (g > empezarCorregir && factorSensibilidad) {
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

  const handleGuardarUmbral = () => {
    const valor = parseInt(nuevoUmbral);
    if (!isNaN(valor)) {
      setEmpezarCorregir(valor);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.resultValue}>
          {insulina !== null ? insulina : "0"}
        </Text>

        <Text style={styles.resultText}>Tiempo de Espera:</Text>
        <Text style={styles.resultValue}>
          {espera !== null ? espera : "0"}
        </Text>
      </View>

      <View style={styles.umbralContainer}>
        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
          Empezar a corregir glucosa:
        </Text>
        <TextInput
          style={styles.umbralInput}
          keyboardType="numeric"
          value={nuevoUmbral}
          onChangeText={setNuevoUmbral}
          onBlur={handleGuardarUmbral}
        />
      </View>

      {/* Bloque de 70% y 30% */}
      <View style={styles.porcentajes}>
        <Text style={styles.resultText}>70% de Insulina:</Text>
        <Text style={styles.resultValue}>
          {insulina !== null ? (insulina * 0.7).toFixed(1) : "-"}
        </Text>

        <Text style={styles.resultText}>30% de Insulina:</Text>
        <Text style={styles.resultValue}>
          {insulina !== null ? (insulina * 0.3).toFixed(1) : "-"}
        </Text>
      </View>

      <TouchableOpacity style={styles.botonExterior} onPress={calculoDInsulina}>
        <Text style={styles.botonInterior}>Calcular</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
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
  botonExterior: {
    marginTop: 20,
    marginBottom: 30,
  },
  umbralContainer: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    borderColor: "#45a0cc",
    borderWidth: 1,
  },
  umbralInput: {
    borderWidth: 1,
    borderColor: "#45a0cc",
    borderRadius: 10,
    padding: 5,
    width: 100,
    textAlign: "center",
  },
  porcentajes: {
    backgroundColor: "white",
    borderColor: "#45a0cc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: 200,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});
