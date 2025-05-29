import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RecordatorioLenta() {
  const [alarmas, setAlarmas] = useState<
    { id: number; nombre: string; unidades: string; hora: Date }[]
  >([]);
  const [nombre, setNombre] = useState("");
  const [unidades, setUnidades] = useState("");
  const [visible, setVisible] = useState(false);
  const [hora, setHora] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  function guardar() {
    if (!nombre || !unidades) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const nuevaAlarma = {
      id: Date.now(),
      nombre,
      unidades,
      hora,
    };

    setAlarmas([...alarmas, nuevaAlarma]);
    setVisible(false);
    setNombre("");
    setUnidades("");
    setHora(new Date());
  }

  function eliminarAlarma(id: number) {
    setAlarmas(alarmas.filter((alarma) => alarma.id !== id));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();
      alarmas.forEach((alarma) => {
        const alarmaHora = new Date(alarma.hora);
        if (
          ahora.getHours() === alarmaHora.getHours() &&
          ahora.getMinutes() === alarmaHora.getMinutes() &&
          ahora.getSeconds() === 0
        ) {
          Alert.alert("Recordatorio", `${alarma.nombre} - ${alarma.unidades}U`);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmas]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {alarmas.map((alarma) => (
          <View key={alarma.id} style={styles.alarma}>
            <Text style={styles.alarmaTitulo}>{alarma.nombre}</Text>
            <Text style={styles.alarmaDetalle}>
              {alarma.unidades}U -{" "}
              {new Date(alarma.hora).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <View style={styles.botonesFila}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.botonEliminar]}
                onPress={() => eliminarAlarma(alarma.id)}
              >
                <Text style={styles.botonAccionTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.boton} onPress={() => setVisible(true)}>
        <Text style={styles.botonTexto}>Añadir Alarma</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Nueva Alarma</Text>

            <TextInput
              placeholder="Nombre de la alarma"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Unidades de insulina lenta"
              style={styles.input}
              value={unidades}
              onChangeText={setUnidades}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={[styles.botonModal, { backgroundColor: "#636e72" }]}
            >
              <Text style={styles.botonTexto}>
                Seleccionar hora:{" "}
                {hora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={hora}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedTime) => {
                  setShowPicker(false);
                  if (selectedTime) setHora(selectedTime);
                }}
              />
            )}

            <TouchableOpacity style={styles.botonModal} onPress={guardar}>
              <Text style={styles.botonTexto}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonModal, styles.botonCancelar]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.botonTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  alarma: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  alarmaTitulo: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  },
  alarmaDetalle: {
    fontSize: 15,
    color: "#555",
  },
  botonesFila: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  botonAccion: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  botonEliminar: {
    backgroundColor: "#e74c3c",
  },
  botonAccionTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  boton: {
    backgroundColor: "#45a0cc",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 20,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContenido: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  botonModal: {
    backgroundColor: "#45a0cc",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  botonCancelar: {
    backgroundColor: "#e74c3c",
  },
});
