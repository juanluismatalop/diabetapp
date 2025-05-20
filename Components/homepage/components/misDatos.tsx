import { useContext, useState } from "react";
import { TextInput, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DatosContext } from "./datosContext";

export default function MisDatos(){
    const {
    setRatioMannana,
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
        setRatioMannana(parseFloat(mannana)||0);
        setRatioMediodia(parseFloat(mediodia)||0);
        setRatioTarde(parseFloat(tarde)||0);
        setRatioNoche(parseFloat(noche)||0);
        setFactorSensibilidad(parseFloat(ff)||0);
        

    }
    return(
        <View style={styles.container}>
            <View style={styles.inputtext}>
                <Text>Ratio de la mañana:</Text><TextInput value={mannana} onChangeText={setMananna} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio del mediodia:</Text><TextInput value={mediodia} onChangeText={setMediodia} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio de la tarde:</Text><TextInput value={tarde} onChangeText={setTarde} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio de la noche:</Text><TextInput value={noche} onChangeText={setNoche} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Factor de sensibilidad:</Text><TextInput value={ff} onChangeText={setFf} keyboardType="numeric" style={styles.styleInput}></TextInput>
            </View>
            <View style={styles.boton}>
                <TouchableOpacity style={styles.botonExterior}>
                    <Text style={styles.botonInterior} onPress={Guardar}>Guardar</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    boton:{
        borderRadius:80,
    },
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
        textAlign: 'center',
        width:100,
        backgroundColor:'white'
    }
})
