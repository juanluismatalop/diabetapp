import { View, Text, TextInput, StyleSheet, Image } from "react-native";

export default function Calculadora() {
    function insulina() {
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                    <Text>Glucosa</Text>
                    <TextInput style={styles.input} keyboardType="numeric" />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Raciones</Text>
                    <TextInput style={styles.input} keyboardType="numeric" />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>Aqui se esta trabajando en esto</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
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