import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Alert, StyleSheet, Modal, ActivityIndicator 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RecordatorioLenta() {
  const [recordatorios, setRecordatorios] = useState<Array<{
    id: string;
    nombre: string;
    unidades: string;
    hora: string;
  }>>([]);
  const [unidadesLenta, setUnidadesLenta] = useState('');
  const [nombreRecordatorio, setNombreRecordatorio] = useState('');
  const [hora, setHora] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const agregarRecordatorio = () => {
    if (!nombreRecordatorio || !unidadesLenta) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const nuevoRecordatorio = {
        id: Math.random().toString(36).substr(2, 9),
        nombre: nombreRecordatorio,
        unidades: unidadesLenta,
        hora: hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setRecordatorios([...recordatorios, nuevoRecordatorio]);
      setNombreRecordatorio('');
      setUnidadesLenta('');
      setLoading(false);
      setModalVisible(false);
      Alert.alert("Éxito", "Recordatorio agregado");
    }, 1000);
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setHora(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#45a0cc" />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.titulo}>Recordatorios de Insulina Lenta</Text>
        
        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
          style={[styles.boton, styles.botonSecundario]}
        >
          <Text style={styles.botonTexto}>Agregar Recordatorio</Text>
        </TouchableOpacity>

        {recordatorios.map((recordatorio) => (
          <View key={recordatorio.id} style={styles.recordatorioItem}>
            <Text style={styles.recordatorioTexto}>{recordatorio.nombre}</Text>
            <Text style={styles.recordatorioTexto}>{recordatorio.unidades} unidades</Text>
            <Text style={styles.recordatorioTexto}>Hora: {recordatorio.hora}</Text>
          </View>
        ))}
      </View>

      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent 
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.tituloModal}>Nuevo Recordatorio</Text>
            
            <TextInput
              placeholder="Nombre del recordatorio"
              value={nombreRecordatorio}
              onChangeText={setNombreRecordatorio}
              style={styles.input}
              placeholderTextColor="#999"
            />
            
            <TextInput
              placeholder="Unidades de insulina"
              value={unidadesLenta}
              onChangeText={setUnidadesLenta}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity 
              onPress={() => setShowTimePicker(true)} 
              style={styles.timeButton}
            >
              <Text style={styles.timeButtonText}>
                {hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={hora}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
            
            <TouchableOpacity onPress={agregarRecordatorio} style={styles.boton}>
              <Text style={styles.botonTexto}>Guardar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={[styles.boton, styles.botonCancelar]}
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
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#b5c9f5' 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#45a0cc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  botonSecundario: { 
    backgroundColor: "#58b4e1",
    marginBottom: 20 
  },
  botonCancelar: { 
    backgroundColor: "#e74c3c" 
  },
  botonTexto: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  timeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  timeButtonText: {
    color: "#333",
    fontWeight: "bold"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#333',
  },
  recordatorioItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  recordatorioTexto: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  }
});