# Diabetapp #

autor: Juan Luis Mata Lopez

## Para que sirve ## 
Esta app se a creado con el fin de facilitar el calculo las unidades de insulina
tanto para 1 o varias personas 

## Tecnologias usadas ## 
Este codgio en front he usado react native ya que queria dar un gran alcance para la gente 
que le cuesta
Mientras que en el back he trabajado en firebase ya qeu te proporciona un servicio gratuito
con una base de datos noSQL 

## Backend ## 
Como ya he mencionado he trabajado con firebase con estos modulos
```
authentication (para el inicio de sesion)
firestore database
    |
    usuario(coleccion)
        |
        (campos)
        ratioMannana
        ratioMediodia
        ratioTarde
        ratioNoche
        factorSensibilidad
        modoMonitor
        ninnos(subcoleccion)
            |
            ninno
                |
                (campos)
                nombre
                ratioMannana
                ratioMediodia
                ratioTarde
                ratioNoche
                factorSensibilidad

```
## Frontend ## 
Aqui he dividido en dos los

```
    App
    |___login
    |___home
```
### Login ###
el login esta conformado con 2 textInputs para que puedas introducir el usuario y contraseña 

ademas de un modal para poder registrarse
```
<Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.tituloModal}>Registrar nuevo usuario</Text>
            <TextInput
              placeholder="Correo electrónico"
              value={nuevoUsuario}
              onChangeText={setNuevoUsuario}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Contraseña"
              value={nuevaContrasenna}
              onChangeText={setNuevaContrasenna}
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={procesarRegistro} style={styles.boton}>
              <Text style={styles.botonTexto}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.boton, styles.botonCancelar]}>
              <Text style={styles.botonTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
```
Aqui el modal ademas de llamar a el archivo ```firebase.ts```

```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvNrQygTKtbE71NlzVrugURPmsmVCWEDk",
  authDomain: "diabetapp-b39e0.firebaseapp.com",
  projectId: "diabetapp-b39e0",
  storageBucket: "diabetapp-b39e0.appspot.com",
  messagingSenderId: "944537282741",
  appId: "1:944537282741:android:675980e45c8e375496b6fc",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db };
```

### Home ###
el home se conforma de un ```<View>``` donde esta la imagen

un ```<Text>``` que se encarga de saludar al usuario llamadolo por el correo que ha introducido

un ```<View>``` que mostrara el resto de componentes

un ```<View>``` que es un nav bar para que funcione lo anterior

Para mostrar el resultado de esto he usado un switch donde dependiendo el boton que se haya pulsado cambiara este string para qeu el switch cambie de componente

```
switch (pantalla) {
      case 'calculadora':
        return <Calculadora />;
      case 'misDatos':
        return <MisDatos />;
      case 'notas':
        return <Notas />;
      case 'monitor':
        return <ModoMonitor />;
      case 'ajustes':
        return <Ajustes />;
      case 'lenta':
        return <RecordatorioLenta />;
      default:
        return <Notas />;
```
### Componentes de Home ###

## Notas ##
    Este componente genera notas donde se guardaran en un scroolView y se guarda en la memoria local del dispositivo movil
    mediante AsyncStorage

    Estas notas una vez creadas muestran el titulo descripcion un boton de editar un boton de borrar y la fecha de la ultima modificacion o si no se ha modificado la creacion de la nota

## Mis Datos ##

    Este componente se encarga de settear los datos de las ratios de el usuario y el factor de sensibilidad que se guardaran en un Context que los guardara en el firestore y lo podra mandar a cualquier otro componente que llame al context como es la calculadora

    Este a su vez tiene un maximo de ratio que se puede modificar en ajustes pero si una de las ratio supera a la hora de guardar los datos te mandara un alerta y volvera a poner el value 0 para que vuelvas a rellenarlos 

## Calculadora ##
    Este componente es la esencia de la app que se dedica a calcular las unidades de insulina para a partir de la glucosa y las raciones que vayas a introducir en los TextInput que hay en el componente

    __Como usa las ratios__
        Hemos programado donde dependiendo la hora del dia usara una u otra
        - RatioMannana 5AM - 1PM
        - RatioMediodia 1PM - 4PM
        - RatioTarde 4PM - 8PM
        - RatioNoche 8PM - 0AM 
    __Formula de Dosis__
        dosis = ratio raciones + correccion
    __Formula de Correccion__
        ```
        let correccion = 0;
        
        if (g > 150 && factorSensibilidad) {
            correccion = (g - 100) / factorSensibilidad;
        }
        ```
    __Tiempo de Espera__
    Una vez me dijeron que el tiempo de espera es las dos priemeras cifras de la glucosa 
    Ej 243 espero 23 minutos
## Recordatorio de Lenta ##
## Ajustes ##
    Este componente puede hacer dos consas
    - Habilitar o Deshabilitar el modoMonitor
    - Cambiar la RatioMaxima del usuario
## Modo Monitor ##
Solo si esta activo aparecera este boton para acceder al comoponente que tiene dos funcionalidades
## Agregar Niños ##
    Aqui creas niños que se guarda en un array de niños donde se guardan las ratios el nombre de el niño y los factores de sensibilidad
## Calculo de Niños ##
    Aqui pones las raciones(porque se entiende que todo los niños comen lo mismo)
    y a partir de las formulas de ```Calculadora``` ponen la cantidades de insulina de cada niño 