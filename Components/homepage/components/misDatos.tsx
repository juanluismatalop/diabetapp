import { useContext, useState } from "react";
import { TextInput, View, Text, Touchable, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { DatosContext } from "./datosContext";

export default function MisDatos(){
    const {
    setRatioManana,
    setRatioMediodia,
    setRatioTarde,
    setRatioNoche,
    setFactorSensibilidad
    } = useContext(DatosContext);
    const [mannana, setMananna] = useState("");
    const [mediodia, setMediodia] = useState("");
    const [tarde, setTarde] = useState("");
    const [noche, setNoche] = useState("");
    const [ff, setFf] = useState("");

    function Guardar(){
        setMananna(mannana);
        setMediodia(mediodia);
        setTarde(tarde);
        setNoche(noche);
        setFactorSensibilidad(ff);

    }
    return(
        <View>
            <View style={styles.inputtext}>
                <Text>Ratio de la mañana:</Text><TextInput value="" onChangeText={setMananna} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio del mediodia:</Text><TextInput value="" onChangeText={setMediodia} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio de la tarde:</Text><TextInput value="" onChangeText={setTarde} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio de la noche:</Text><TextInput value="" onChangeText={setNoche} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Factor de sensibilidad:</Text><TextInput value="" onChangeText={setFf} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <TouchableOpacity style={styles.botonExterior}>
                <Text style={styles.botonInterior} onPress={Guardar}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    botonInterior:{
        height: 50,
        backgroundColor: '#45a0cc',
        color: 'white',
        alignItems: 'center',
        flex: 1,
    },
    botonExterior:{
        height: 30,
        backgroundColor: '#45a0cc',
        color: 'white',
        alignItems: 'center',
        borderRadius: 80,
    },
    inputtext:{
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',           
        marginBottom: 15,
        
    },
    styleInput:{
        borderColor:'#45a0cc',
        borderWidth: 2,
        borderRadius: 80,
        width:500,
        backgroundColor:'white'
    }
})
