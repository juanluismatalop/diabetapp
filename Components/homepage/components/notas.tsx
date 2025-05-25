import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notas() {
  const [notas, setNotas] = useState<
    { titulo: string; descripcion: string; fecha: string }[]
  >([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ventanaAbierta, setVentanaAbierta] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [notaEditandoIndex, setNotaEditandoIndex] = useState<number | null>(null);

  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const notasGuardadas = await AsyncStorage.getItem('notas');
        if (notasGuardadas) {
          setNotas(JSON.parse(notasGuardadas));
        }
      } catch (error) {
        console.error('Error al cargar notas:', error);
      }
    };
    cargarNotas();
  }, []);

  useEffect(() => {
    const guardarNotas = async () => {
      try {
        await AsyncStorage.setItem('notas', JSON.stringify(notas));
      } catch (error) {
        console.error('Error al guardar notas:', error);
      }
    };
    guardarNotas();
  }, [notas]);

  function annadirOEditarNota() {
    if (titulo.trim() === '' && descripcion.trim() === '') {
      cerrarModal();
      return;
    }

    const fecha = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (modoEdicion && notaEditandoIndex !== null) {
      const nuevasNotas = [...notas];
      nuevasNotas[notaEditandoIndex] = {
        ...nuevasNotas[notaEditandoIndex],
        titulo,
        descripcion,
        fecha, // ✅ Actualiza la fecha al editar
      };
      setNotas(nuevasNotas);
    } else {
      setNotas([...notas, { titulo, descripcion, fecha }]);
    }

    cerrarModal();
  }

  function eliminarNota(index: number) {
    const nuevasNotas = notas.filter((_, i) => i !== index);
    setNotas(nuevasNotas);
  }

  function editarNota(index: number) {
    const nota = notas[index];
    setTitulo(nota.titulo);
    setDescripcion(nota.descripcion);
    setNotaEditandoIndex(index);
    setModoEdicion(true);
    setVentanaAbierta(true);
  }

  function cerrarModal() {
    setTitulo('');
    setDescripcion('');
    setModoEdicion(false);
    setNotaEditandoIndex(null);
    setVentanaAbierta(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notas.map((nota, index) => (
          <View key={index} style={styles.nota}>
            <Text style={styles.tituloNota}>{nota.titulo}</Text>
            <Text style={styles.descripcionNota}>{nota.descripcion}</Text>
            <Text style={styles.fechaNota}>{nota.fecha}</Text>
            <View style={styles.botonesFila}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.botonEditar]}
                onPress={() => editarNota(index)}
              >
                <Text style={styles.botonAccionTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botonAccion, styles.botonEliminar]}
                onPress={() => eliminarNota(index)}
              >
                <Text style={styles.botonAccionTexto}>Borrar</Text>
              </TouchableOpacity>
            </View>
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
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>
              {modoEdicion ? 'Editar Nota' : 'Nueva Nota'}
            </Text>

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

            <TouchableOpacity style={styles.botonModal} onPress={annadirOEditarNota}>
              <Text style={styles.botonTexto}>
                {modoEdicion ? 'Guardar Cambios' : 'Añadir'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonModal, styles.botonCancelar]}
              onPress={cerrarModal}
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
    paddingHorizontal: 20,
    paddingTop: 10,
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
  fechaNota: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  botonesFila: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  botonAccion: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  botonEditar: {
    backgroundColor: '#f1c40f',
  },
  botonEliminar: {
    backgroundColor: '#e74c3c',
  },
  botonAccionTexto: {
    color: '#fff',
    fontWeight: 'bold',
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
