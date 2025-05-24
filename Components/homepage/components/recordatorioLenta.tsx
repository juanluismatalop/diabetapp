import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function RecordatorioLenta() {
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [unidades, setUnidades] = useState('');
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    pedirPermisos();
  }, []);

  const pedirPermisos = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Activa las notificaciones en la configuración del dispositivo.');
    }
  };

  const programarNotificacion = async (titulo: string, cuerpo: string, fecha: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: cuerpo,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR, // Corrected line
        hour: fecha.getHours(),
        minute: fecha.getMinutes(),
        repeats: true,
      },
    });
  };

  const agregarRecordatorio = async () => {
    if (!nombre || !unidades) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const nuevaHora = new Date(hora);
    const ahora = new Date();
    if (nuevaHora < ahora) {
      nuevaHora.setDate(nuevaHora.getDate() + 1); 
    }

    const nuevo = {
      id: Math.random().toString(36).substr(2, 9),
      nombre,
      unidades,
      hora: nuevaHora,
    };

    await programarNotificacion(
      'Recordatorio de insulina',
      `${nombre} - ${unidades} unidades`,
      nuevaHora
    );

    setRecordatorios([...recordatorios, nuevo]);
    setNombre('');
    setUnidades('');
    setHora(new Date());
    setModalVisible(false);
    Alert.alert("✅ Éxito", "Recordatorio programado");
  };

  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setHora(selectedDate);
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}></Text>

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.botonTexto}>+ Nuevo Recordatorio</Text>
      </TouchableOpacity>

      {recordatorios.map((rec) => (
        <View key={rec.id} style={styles.recordatorio}>
          <Text style={styles.recTitulo}>{rec.nombre}</Text>
          <Text style={styles.recDescripcion}>{rec.unidades} unidades</Text>
          <Text style={styles.recHora}>🕒 {formatearHora(rec.hora)}</Text>
        </View>
      ))}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Agregar Recordatorio</Text>

            <TextInput
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Unidades"
              value={unidades}
              onChangeText={setUnidades}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.timeButton}
            >
              <Text style={styles.timeText}>⏱ Hora: {formatearHora(hora)}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={hora}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTime}
              />
            )}

            <TouchableOpacity style={styles.botonGuardar} onPress={agregarRecordatorio}>
              <Text style={styles.botonTexto}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={() => setModalVisible(false)}>
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
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  botonAgregar: {
    backgroundColor: '#45a0cc',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordatorio: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  recTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recDescripcion: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  recHora: {
    fontSize: 14,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  botonGuardar: {
    backgroundColor: '#45a0cc',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonCancelar: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
});