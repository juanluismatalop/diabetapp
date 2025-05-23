import { TouchableOpacity, View, Text, Modal, TextInput } from "react-native";

export default function AnnadirPersona(){
    return(
        <View>
            <TouchableOpacity>
                <Text>Añadir</Text>
            </TouchableOpacity>
            <Modal>
                <Text>Nombre</Text>
                <TextInput></TextInput>
                <Text>Ratio Mañana</Text>
                <TextInput></TextInput>
                <Text>Ratio Mediodia</Text>
                <TextInput></TextInput>
                <Text>Ratio Tarde</Text>
                <TextInput></TextInput>
                <Text>Ratio Noche</Text>
                <TextInput></TextInput>
                <Text>Factor de Sensibilidad</Text>
                <TextInput></TextInput>
            </Modal>
        </View>
    );

}