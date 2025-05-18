import { useState } from "react";
import { View, Image, StyleSheet, Text, Alert, TouchableOpacity, TextInput} from "react-native";

export default function Login({loginExitoso}: { loginExitoso: () => void }){
    const [usuario, setUsuario] = useState('');
    const [contrasenna, setContrasenna] = useState('')

    function procesarLogin(){
        if(usuario === 'usuario' && contrasenna === 'usuario'){
            loginExitoso();
        }
        else{
            Alert.alert('Error', 'Usuario o contraseña incorrectos');
        }
    }
    return(
        <View>
             <View style={styles.imagenlogo}>
                  <Image source={require('../../Components/pictures/diabetapp.png')}
                    resizeMode="contain"
                    style={styles.logo}/>
            </View>
            <View style={styles.formulario}>
                <View style={styles.formularioInputs}>
                    <Text>Usuario</Text><TextInput style={styles.input} value={usuario} onChangeText={setUsuario}></TextInput>
                </View>
                <View style={styles.formularioInputs}>
                    <Text>Contraseña</Text><TextInput style={styles.input} value={contrasenna} onChangeText={setContrasenna} secureTextEntry={true}></TextInput>
                </View>
                <TouchableOpacity onPress={procesarLogin} style={styles.botonExterior}>
                    <Text style={styles.botonInterior}>Iniciar Sesion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    logo:{
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    imagenlogo:{
      alignItems: 'center'
    },
    formulario:{
        marginTop:20,
        marginBottom:30,
    },
    formularioInputs:{
        flexDirection:'row',
        margin:10,
    },
    input: {
        borderColor: '#45a0cc',
        borderWidth: 1,
        borderRadius: 20,
        width: 60,
        padding: 5,
        marginLeft: 10,
        textAlign: 'center',
        backgroundColor:'white'
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
