import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

// Configurar el manejador de notificaciones para que se muestren cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Muestra la alerta (ej. un pop-up)
    shouldPlaySound: true, // Reproduce el sonido
    shouldSetBadge: false, // No actualiza la insignia de la app
    // --- ¡LAS PROPIEDADES QUE FALTABAN ESTÁN AQUÍ! ---
    shouldShowBanner: true, // Muestra la notificación como un banner (en la parte superior de la pantalla)
    shouldShowList: true,   // Muestra la notificación en la lista de notificaciones del sistema
    // --------------------------------------------------
  }),
});

export default function RecordatorioLenta() {
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [unidades, setUnidades] = useState('');
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState(new Date()); // Inicializa con la hora actual
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    pedirPermisos();
    // Aquí podrías cargar notificaciones programadas existentes si las persistes (guardas en almacenamiento local)
    // Para este ejemplo, asumimos que se añaden de nuevo cada vez que la app se inicia
  }, []);

  const pedirPermisos = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos tu permiso para enviar notificaciones. Actívalas en la configuración del dispositivo.');
    }
  };

  const programarNotificacion = async (titulo: string, cuerpo: string, fecha: Date) => {
    // Programa la notificación para que se repita diariamente a la hora y minuto especificados
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: cuerpo,
        sound: true, // Esto habilita el sonido de la notificación
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR, // Especificar explícitamente el tipo de trigger
        hour: fecha.getHours(),
        minute: fecha.getMinutes(),
        repeats: true, // Esto hace que se repita diariamente
      },
    });
    return notificationId; // Devuelve el ID para almacenarlo
  };

  const agregarRecordatorio = async () => {
    if (!nombre || !unidades) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const nuevaHora = new Date(hora);
    const ahora = new Date();
    // Si la hora seleccionada ya pasó hoy, programarla para mañana
    if (nuevaHora.getHours() < ahora.getHours() || (nuevaHora.getHours() === ahora.getHours() && nuevaHora.getMinutes() <= ahora.getMinutes())) {
      nuevaHora.setDate(nuevaHora.getDate() + 1);
    }

    // Programar la notificación y obtener su ID
    const notificationId = await programarNotificacion(
      'Recordatorio de insulina',
      `${nombre} - ${unidades} unidades`,
      nuevaHora
    );

    const nuevo = {
      id: Math.random().toString(36).substr(2, 9), // Tu ID local
      notificationId: notificationId, // ID de la notificación de Expo
      nombre,
      unidades,
      hora: nuevaHora,
    };

    setRecordatorios([...recordatorios, nuevo]);
    setNombre('');
    setUnidades('');
    setHora(new Date()); // Restablecer el selector de hora a la hora actual
    setModalVisible(false);
    Alert.alert("✅ Éxito", "Recordatorio programado");
  };

  const formatearHora = (fecha: Date) => {
    // Formatea la hora a HH:MM (24 horas)
    return fecha.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Usar formato de 24 horas para consistencia
    });
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || hora;
    // En iOS, el selector puede permanecer abierto para ajustes; en Android, se cierra al seleccionar
    setShowPicker(Platform.OS === 'ios');
    setHora(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Recordatorios de Insulina Lenta</Text>

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.botonTexto}>+ Nuevo Recordatorio</Text>
      </TouchableOpacity>

      {/* Usamos ScrollView para que la lista de recordatorios sea desplazable */}
      <ScrollView style={styles.recordatoriosList}>
        {recordatorios.length === 0 ? (
          <Text style={styles.noRecordatoriosText}>No hay recordatorios programados. ¡Agrega uno!</Text>
        ) : (
          recordatorios.map((rec) => (
            <View key={rec.id} style={styles.recordatorio}>
              <Text style={styles.recTitulo}>{rec.nombre}</Text>
              <Text style={styles.recDescripcion}>{rec.unidades} unidades</Text>
              <Text style={styles.recHora}>🕒 {formatearHora(rec.hora)}</Text>
              {/* Aquí podrías añadir un botón para eliminar usando rec.notificationId para cancelar */}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para agregar/editar recordatorios */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Agregar Recordatorio</Text>

            <TextInput
              placeholder="Nombre de la insulina"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Cantidad de unidades"
              value={unidades}
              onChangeText={setUnidades}
              keyboardType="numeric" // Teclado numérico para unidades
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
                is24Hour={true} // Asegura el formato de 24 horas
                display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Estilo diferente para iOS
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
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 20,
    paddingTop: 10,
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
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordatoriosList: {
    paddingBottom: 20,
  },
  recordatorio: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#45a0cc',
  },
  recTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recDescripcion: {
    fontSize: 15,
    color: '#555',
  },
  recHora: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noRecordatoriosText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  timeButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: 15,
  },
  botonGuardar: {
    backgroundColor: '#45a0cc',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonCancelar: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
});
