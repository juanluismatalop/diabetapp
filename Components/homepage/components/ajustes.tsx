import React, { useContext, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { DatosContext } from "./datosContext";

export default function Ajustes(){
    const {modoMonitor, setModoMonitor} = useContext(DatosContext);

    
    function monitor(){
        
    }
    return(
        <TouchableOpacity onPress={monitor} style={styles.botonExterior}>
            <Text style={styles.botonInterior}>Habilitar Modo Monitor</Text>
            <View> </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    luz:{
        width:10,
        height:10,
        backgroundColor:'red'
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
})