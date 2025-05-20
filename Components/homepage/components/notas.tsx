import { useState } from "react"
import { ScrollView, TouchableOpacity, View, Image, Modal, Text, TextInput, StyleSheet} from "react-native";

export default function Notas(){
    const[notas, setNotas]=useState([]);
    const[titulo, setTitulo]=useState('');
    const[descripcion, setDescripcion]=useState('');
    const [ventanaAbierta, setVentanaAbierta]=useState(false);

    function annadirNotas(){
        if(titulo===''&&descripcion===''){
            setVentanaAbierta(false);
        }else{
            setNotas([...notas, { titulo: titulo, descripcion: descripcion }]);
            setTitulo('');
            setDescripcion('');
            setVentanaAbierta(false);
        }
    }

    return(
        <View>
            <ScrollView>
                {notas.map((nota, index)=>
                    <View key={index} style={styles.ventana}>
                        <Text>{nota.titulo}</Text>
                        <Text>{nota.descripcion}</Text>
                    </View>
                )}
            </ScrollView>
            <View>
                <TouchableOpacity onPress={() => setVentanaAbierta(true)} style={styles.boton}>
                    <Text style={styles.botonInterior}>Añadir</Text>
                </TouchableOpacity>
                <Modal style={styles.ventanaModal} visible={ventanaAbierta} transparent={true} animationType="slide">
                    <View style={styles.ventana}>
                        <Text>Titulo</Text>
                        <TextInput value={titulo} onChangeText={setTitulo}/>
                        <Text>Descripcion</Text>
                        <TextInput value={descripcion} onChangeText={setDescripcion}/>
                        <TouchableOpacity onPress={annadirNotas} style={styles.boton}>
                            <Text style={styles.botonInterior}>Añadir Nota</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    ventana:{
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: '#45a0cc',
        borderRadius: 80,
        alignItems: 'center',
    },
    ventanaModal:{
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: '#45a0cc',
        borderRadius: 80,
        alignItems: 'center',
        height: 100,
        width: 100,
    },
    boton:{
        backgroundColor:'#45a0cc',
        borderRadius:80,
        alignItems: 'center',
        marginTop: 20,
    },
    botonInterior:{
        color:'wvhite'
    },
    titulo:{
        fontSize:50,
    },
})