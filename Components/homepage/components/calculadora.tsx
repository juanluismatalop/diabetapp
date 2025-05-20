import { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import { DatosContext } from "./datosContext";

export default function Calculadora() {
    const {ratioMannana, ratioMediodia, ratioTarde, ratioNoche, factorSensibilidad} = useContext(DatosContext);
    const [insulina, setInsulina] = useState(0);
    const [espera, setEspera] = useState(0);
    const [raciones, setRaciones] = useState("");
    const [glucosa, setGlucosa] = useState("")
    const hora = new Date().getHours();
    function calculoDInsulina() {
        const r = parseFloat(raciones)||0;
        const g = parseFloat(glucosa) ||0;
        let correccion = 0;
        if (g > 150 && factorSensibilidad) {
            correccion = (g - 100) / factorSensibilidad;
        }

        if(hora >= 5 && hora < 13){
            setInsulina(Math.round((ratioMannana*r)+correccion));
        }else if(hora >= 13 && hora < 17){
            setInsulina(Math.round((ratioMediodia*r)+correccion));
            console.log(insulina)
        }else if(hora >= 17 && hora <20){
            setInsulina(Math.round((ratioTarde*r)+correccion));
        }else if(hora >= 20 && hora <24){
            setInsulina(Math.round((ratioNoche*r)+correccion));
        }else{
            setInsulina(Math.round((ratioTarde*r)+correccion));
        }
        setEspera(Math.floor(g/10))
    }
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                    <Text>Glucosa</Text>
                    <TextInput style={styles.input} onChangeText={setGlucosa} keyboardType="numeric" />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Raciones</Text>
                    <TextInput style={styles.input} onChangeText={setRaciones} keyboardType="numeric" />
                </View>
            </View>
            <View style={styles.calculadora}>
                <View style={styles.contenido}>
                    <Text style={styles.contenido}>Insulina que poner</Text>
                    {insulina}
                </View>
                <View style={styles.contenido}>
                    <Text style={styles.contenido} >Tiempo de Espera</Text>
                    {espera}
                </View>
                <TouchableOpacity style={styles.botonExterior} onPress={calculoDInsulina}>
                    <Text style={styles.botonInterior}>Calcular</Text>
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
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    contenido:{
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
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
    calculadora:{
        backgroundColor:'white',
        height:200,
        width:200,
        borderColor: '#45a0cc',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',

    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'white',
        borderWidth: 1,
        borderColor: '#45a0cc',
        borderRadius: 25,
        padding: 10,
        marginHorizontal: 5,
    },
    input: {
        borderColor: '#45a0cc',
        borderWidth: 1,
        borderRadius: 20,
        width: 60,
        padding: 5,
        marginLeft: 10,
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
    },
});