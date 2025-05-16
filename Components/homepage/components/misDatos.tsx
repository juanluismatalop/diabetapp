import { TextInput, View, Text, Touchable, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function MisDatos(){
    return(
        <View>
            <Text>Ratio de la mañana:</Text><TextInput></TextInput>
            <Text>Ratio del mediodia:</Text><TextInput></TextInput>
            <Text>Ratio de la tarde:</Text><TextInput></TextInput>
            <Text>Ratio de la noche:</Text><TextInput></TextInput>
            <Text>Factor de sensibilidad:</Text><TextInput></TextInput>
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
    }
})
