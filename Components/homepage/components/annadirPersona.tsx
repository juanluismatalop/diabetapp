import React, { useState, useContext, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { DatosContext } from "./datosContext";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Ninno {
  id: string;
  nombre: string;
  ratioManana: number;
  ratioMediodia: number;
  ratioTarde: number;
  ratioNoche: number;
  factorSensibilidad: number;
  usuarioId: string;
}

export default function GestionNinnos() {
  const {
    ninnos,
    cargandoNinnos,
    addNinno,
    updateNinno,
    deleteNinno,
    usuarioId
  } = useContext(DatosContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ratioManana, setRatioManana] = useState("0");
  const [ratioMediodia, setRatioMediodia] = useState("0");
  const [ratioTarde, setRatioTarde] = useState("0");
  const [ratioNoche, setRatioNoche] = useState("0");
  const [factorSensibilidad, setFactorSensibilidad] = useState("0");
  const [editId, setEditId] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  // Limpiar formulario al cerrar modal
  useEffect(() => {
    if (!modalVisible) {
      limpiarInputs();
    }
  }, [modalVisible]);

  const editarNinno = (id: string) => {
    const ninno = ninnos.find(n => n.id === id);
    if (ninno) {
      setNombre(ninno.nombre);
      setRatioManana(ninno.ratioManana.toString());
      setRatioMediodia(ninno.ratioMediodia.toString());
      setRatioTarde(ninno.ratioTarde.toString());
      setRatioNoche(ninno.ratioNoche.toString());
      setFactorSensibilidad(ninno.factorSensibilidad.toString());
      setEditId(id);
      setModalVisible(true);
    }
  };

  const limpiarInputs = () => {
    setNombre("");
    setRatioManana("0");
    setRatioMediodia("0");
    setRatioTarde("0");
    setRatioNoche("0");
    setFactorSensibilidad("0");
    setEditId(null);
  };

  const validarDatos = (): boolean => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return false;
    }
    return true;
  };

  const guardarNinno = async () => {
    if (!validarDatos() || !usuarioId) return;
    
    setProcesando(true);
    
    try {
      const nuevoNinno = {
        nombre: nombre.trim(),
        ratioManana: parseFloat(ratioManana) || 0,
        ratioMediodia: parseFloat(ratioMediodia) || 0,
        ratioTarde: parseFloat(ratioTarde) || 0,
        ratioNoche: parseFloat(ratioNoche) || 0,
        factorSensibilidad: parseFloat(factorSensibilidad) || 0,
        usuarioId
      };

      if (editId) {
        await updateNinno(editId, nuevoNinno);
      } else {
        await addNinno(nuevoNinno);
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error("Error al guardar niño:", error);
      Alert.alert("Error", "No se pudo guardar el niño. Inténtalo de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  const confirmarEliminar = (id: string) => {
    const ninno = ninnos.find(n => n.id === id);
    Alert.alert(
      "Eliminar niño",
      `¿Estás seguro que quieres eliminar a ${ninno?.nombre}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => eliminarNinno(id),
        },
      ],
      { cancelable: true }
    );
  };

  const eliminarNinno = async (id: string) => {
    try {
      await deleteNinno(id);
    } catch (error) {
      console.error("Error al eliminar niño:", error);
      Alert.alert("Error", "No se pudo eliminar el niño. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setModalVisible(true)}
        disabled={cargandoNinnos}
      >
        <Icon name="add" size={24} color="white" />
        <Text style={styles.textoBotonAgregar}>Añadir Niño</Text>
      </TouchableOpacity>

      {cargandoNinnos ? (
        <View style={styles.cargandoContainer}>
          <ActivityIndicator size="large" color="#45a0cc" />
          <Text style={styles.textoCargando}>Cargando niños...</Text>
        </View>
      ) : ninnos.length === 0 ? (
        <View style={styles.listaVacia}>
          <Text style={styles.textoListaVacia}>No hay niños registrados</Text>
        </View>
      ) : (
        <ScrollView style={styles.listaContainer}>
          {ninnos.map((ninno) => (
            <View key={ninno.id} style={styles.tarjeta}>
              <View style={styles.headerTarjeta}>
                <Text style={styles.nombre}>{ninno.nombre}</Text>
              </View>
              
              <View style={styles.datosContainer}>
                <View style={styles.datoRow}>
                  <Icon name="wb-sunny" size={16} color="#FFA500" />
                  <Text style={styles.dato}>Mañana: {ninno.ratioManana}</Text>
                </View>
                <View style={styles.datoRow}>
                  <Icon name="wb-sunny" size={16} color="#FFD700" />
                  <Text style={styles.dato}>Mediodía: {ninno.ratioMediodia}</Text>
                </View>
                <View style={styles.datoRow}>
                  <Icon name="wb-twilight" size={16} color="#FF8C00" />
                  <Text style={styles.dato}>Tarde: {ninno.ratioTarde}</Text>
                </View>
                <View style={styles.datoRow}>
                  <Icon name="nights-stay" size={16} color="#483D8B" />
                  <Text style={styles.dato}>Noche: {ninno.ratioNoche}</Text>
                </View>
                <View style={styles.datoRow}>
                  <Icon name="settings" size={16} color="#666" />
                  <Text style={styles.dato}>Sensibilidad: {ninno.factorSensibilidad}</Text>
                </View>
              </View>

              <View style={styles.botonesTarjeta}>
                <TouchableOpacity
                  style={[styles.botonAccion, styles.botonEditar]}
                  onPress={() => editarNinno(ninno.id)}
                >
                  <Icon name="edit" size={16} color="white" />
                  <Text style={styles.textoBotonAccion}> Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botonAccion, styles.botonEliminar]}
                  onPress={() => confirmarEliminar(ninno.id)}
                >
                  <Icon name="delete" size={16} color="white" />
                  <Text style={styles.textoBotonAccion}> Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !procesando && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.tituloModal}>
                {editId ? "Editar Niño" : "Añadir Nuevo Niño"}
              </Text>
              
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre completo"
                editable={!procesando}
              />

              <View style={styles.seccionRatios}>
                <Text style={styles.subtitulo}>Ratios de Insulina</Text>
                
                <Text style={styles.label}>Mañana</Text>
                <TextInput
                  style={styles.input}
                  value={ratioManana}
                  onChangeText={setRatioManana}
                  keyboardType="numeric"
                  editable={!procesando}
                />

                <Text style={styles.label}>Mediodía</Text>
                <TextInput
                  style={styles.input}
                  value={ratioMediodia}
                  onChangeText={setRatioMediodia}
                  keyboardType="numeric"
                  editable={!procesando}
                />

                <Text style={styles.label}>Tarde</Text>
                <TextInput
                  style={styles.input}
                  value={ratioTarde}
                  onChangeText={setRatioTarde}
                  keyboardType="numeric"
                  editable={!procesando}
                />

                <Text style={styles.label}>Noche</Text>
                <TextInput
                  style={styles.input}
                  value={ratioNoche}
                  onChangeText={setRatioNoche}
                  keyboardType="numeric"
                  editable={!procesando}
                />
              </View>

              <Text style={styles.label}>Factor de Sensibilidad</Text>
              <TextInput
                style={styles.input}
                value={factorSensibilidad}
                onChangeText={setFactorSensibilidad}
                keyboardType="numeric"
                editable={!procesando}
              />

              <View style={styles.botonesModal}>
                <TouchableOpacity
                  style={[styles.botonModal, styles.botonCancelar]}
                  onPress={() => !procesando && setModalVisible(false)}
                  disabled={procesando}
                >
                  <Text style={styles.textoBotonModal}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonModal, styles.botonGuardar, procesando && styles.botonDisabled]}
                  onPress={guardarNinno}
                  disabled={procesando}
                >
                  {procesando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.textoBotonModal}>
                      {editId ? "Actualizar" : "Guardar"}
                    </Text>
                  )}
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
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  botonAgregar: {
    flexDirection: 'row',
    backgroundColor: "#45a0cc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  textoBotonAgregar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    marginTop: 16,
    color: '#666',
  },
  listaVacia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoListaVacia: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  listaContainer: {
    flex: 1,
  },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombre: {
    fontWeight: "bold",
    fontSize: 18,
    color: '#333',
  },
  datosContainer: {
    marginVertical: 8,
  },
  datoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dato: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  botonesTarjeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  botonAccion: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
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
    fontWeight: "500",
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
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 6,
    color: '#555',
  },
  subtitulo: {
    fontWeight: "bold",
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  seccionRatios: {
    marginVertical: 8,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  botonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  botonModal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: "#e0e0e0",
  },
  botonGuardar: {
    backgroundColor: "#45a0cc",
  },
  botonDisabled: {
    opacity: 0.6,
  },
  textoBotonModal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});