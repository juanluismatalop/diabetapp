import { useContext, useState } from "react";
import { TextInput, View, Text, Touchable, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { DatosContext } from "./datosContext";

export default function MisDatos(){
    const { setRatioMannana, setRatioMediodia, setRatioTarde, setRatioNoche, setFactordesensibilidad } = useContext(DatosContext);

    return(
        <View>
            <View style={styles.inputtext}>
                <Text>Ratio de la mañana:</Text><TextInput keyboardType="numeric"></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio del mediodia:</Text><TextInput keyboardType="numeric"></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio de la tarde:</Text><TextInput keyboardType="numeric"></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Ratio de la noche:</Text><TextInput keyboardType="numeric"></TextInput>
            </View>
            <View style={styles.inputtext}>
                <Text>Factor de sensibilidad:</Text><TextInput keyboardType="numeric"></TextInput>
            </View>
            <TouchableOpacity style={styles.botonExterior}>
                <Text style={styles.botonInterior}>Guardar</Text>
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
        height: 50,
        backgroundColor: '#45a0cc',
        color: 'white',
        alignItems: 'center',
    },
    inputtext:{
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',           
        marginBottom: 15,
    }
})
