import React, { useState, useContext } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { DatosContext } from "./datosContext";

export default function AnnadirPersona() {
  const { ninnos, setNinnos } = useContext(DatosContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ratioManana, setRatioManana] = useState("");
  const [ratioMediodia, setRatioMediodia] = useState("");
  const [ratioTarde, setRatioTarde] = useState("");
  const [ratioNoche, setRatioNoche] = useState("");
  const [factorSensibilidad, setFactorSensibilidad] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const editarPersona = (index) => {
    const persona = ninnos[index];
    setNombre(persona.nombre);
    setRatioManana(persona.ratioManana.toString());
    setRatioMediodia(persona.ratioMediodia.toString());
    setRatioTarde(persona.ratioTarde.toString());
    setRatioNoche(persona.ratioNoche.toString());
    setFactorSensibilidad(persona.factorSensibilidad.toString());
    setEditIndex(index);
    setModalVisible(true);
  };

  const limpiarInputs = () => {
    setNombre("");
    setRatioManana("");
    setRatioMediodia("");
    setRatioTarde("");
    setRatioNoche("");
    setFactorSensibilidad("");
    setEditIndex(null);
  };

  const validarDatos = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return false;
    }
    return true;
  };

  const guardarPersona = () => {
    if (!validarDatos()) return;

    const nuevaPersona = {
      nombre: nombre.trim(),
      ratioManana: parseFloat(ratioManana) || 0,
      ratioMediodia: parseFloat(ratioMediodia) || 0,
      ratioTarde: parseFloat(ratioTarde) || 0,
      ratioNoche: parseFloat(ratioNoche) || 0,
      factorSensibilidad: parseFloat(factorSensibilidad) || 0,
    };

    if (editIndex !== null) {
      const ninnosActualizados = [...ninnos];
      ninnosActualizados[editIndex] = nuevaPersona;
      setNinnos(ninnosActualizados);
    } else {
      setNinnos([...ninnos, nuevaPersona]);
    }

    limpiarInputs();
    setModalVisible(false);
  };

  const eliminarPersona = (index) => {
    Alert.alert(
      "Eliminar persona",
      `¿Estás seguro que quieres eliminar a ${ninnos[index].nombre}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const nuevosNinnos = ninnos.filter((_, i) => i !== index);
            setNinnos(nuevosNinnos);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botonExterior}
        onPress={() => {
          limpiarInputs();
          setModalVisible(true);
        }}
      >
        <Text style={styles.botonInterior}>Añadir Persona</Text>
      </TouchableOpacity>

      <ScrollView style={styles.listaContainer}>
        {ninnos.map((persona, index) => (
          <View key={index} style={styles.tarjeta}>
            <Text style={styles.nombre}>{persona.nombre}</Text>
            <View style={styles.datosContainer}>
              <Text style={styles.dato}>Mañana: {persona.ratioManana}</Text>
              <Text style={styles.dato}>Mediodía: {persona.ratioMediodia}</Text>
              <Text style={styles.dato}>Tarde: {persona.ratioTarde}</Text>
              <Text style={styles.dato}>Noche: {persona.ratioNoche}</Text>
              <Text style={styles.dato}>Sensibilidad: {persona.factorSensibilidad}</Text>
            </View>

            <View style={styles.botonesTarjeta}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.botonEditar]}
                onPress={() => editarPersona(index)}
              >
                <Text style={styles.textoBotonAccion}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonAccion, styles.botonEliminar]}
                onPress={() => eliminarPersona(index)}
              >
                <Text style={styles.textoBotonAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre completo"
              />

              <Text style={styles.label}>Ratio Mañana</Text>
              <TextInput
                style={styles.input}
                value={ratioManana}
                onChangeText={setRatioManana}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Text style={styles.label}>Ratio Mediodía</Text>
              <TextInput
                style={styles.input}
                value={ratioMediodia}
                onChangeText={setRatioMediodia}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Text style={styles.label}>Ratio Tarde</Text>
              <TextInput
                style={styles.input}
                value={ratioTarde}
                onChangeText={setRatioTarde}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Text style={styles.label}>Ratio Noche</Text>
              <TextInput
                style={styles.input}
                value={ratioNoche}
                onChangeText={setRatioNoche}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Text style={styles.label}>Factor de Sensibilidad</Text>
              <TextInput
                style={styles.input}
                value={factorSensibilidad}
                onChangeText={setFactorSensibilidad}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <View style={styles.botonesModal}>
                <TouchableOpacity
                  style={[styles.botonModal, styles.botonCancelar]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textoBotonModal}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonModal, styles.botonGuardar]}
                  onPress={guardarPersona}
                >
                  <Text style={styles.textoBotonModal}>
                    {editIndex !== null ? "Actualizar" : "Guardar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  botonExterior: {
    backgroundColor: "#45a0cc",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  botonInterior: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  listaContainer: {
    flex: 1,
  },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  nombre: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  datosContainer: {
    marginBottom: 10,
  },
  dato: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  botonesTarjeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  botonAccion: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEditar: {
    backgroundColor: "#4CAF50",
  },
  botonEliminar: {
    backgroundColor: "#ff4444",
  },
  textoBotonAccion: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  botonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    gap: 15,
  },
  botonModal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: "#e0e0e0",
  },
  botonGuardar: {
    backgroundColor: "#45a0cc",
  },
  textoBotonModal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});