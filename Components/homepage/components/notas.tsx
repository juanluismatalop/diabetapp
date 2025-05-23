import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function Notas() {
  const [notas, setNotas] = useState<{ titulo: string; descripcion: string }[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ventanaAbierta, setVentanaAbierta] = useState(false);

  function annadirNotas() {
    if (titulo.trim() === '' && descripcion.trim() === '') {
      setVentanaAbierta(false);
      return;
    }
    setNotas([...notas, { titulo, descripcion }]);
    setTitulo('');
    setDescripcion('');
    setVentanaAbierta(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notas.map((nota, index) => (
          <View key={index} style={styles.nota}>
            <Text style={styles.tituloNota}>{nota.titulo}</Text>
            <Text style={styles.descripcionNota}>{nota.descripcion}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.boton} onPress={() => setVentanaAbierta(true)}>
        <Text style={styles.botonTexto}>Añadir Nota</Text>
      </TouchableOpacity>

      <Modal
        visible={ventanaAbierta}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVentanaAbierta(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Nueva Nota</Text>

            <TextInput
              placeholder="Título"
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Descripción"
              style={[styles.input, { height: 80 }]}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline={true}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.botonModal} onPress={annadirNotas}>
              <Text style={styles.botonTexto}>Añadir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonModal, styles.botonCancelar]}
              onPress={() => setVentanaAbierta(false)}
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
    paddingBottom: 20,
  },
  nota: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tituloNota: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  descripcionNota: {
    fontSize: 15,
    color: '#555',
  },
  boton: {
    backgroundColor: '#45a0cc',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContenido: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  botonModal: {
    backgroundColor: '#45a0cc',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonCancelar: {
    backgroundColor: '#e74c3c',
  },
});
