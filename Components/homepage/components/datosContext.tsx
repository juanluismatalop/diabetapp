import React, { createContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../firebase/firebase"; // Asegúrate de que esta ruta sea correcta

// --- Interfaces para tipado ---

// Define la estructura de un niño/niña. Añade aquí todas las propiedades que uses.
interface Ninno {
  id: string;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion?: string; // Opcional, ya que no siempre se actualiza
  // Añade otras propiedades que uses en tu aplicación para un niño, ejemplo:
  // edad: number;
  // sexo: 'masculino' | 'femenino';
}

// Define la estructura de los datos del usuario que se guardan en Firestore.
interface UserData {
  ratioMannana: number;
  ratioMediodia: number;
  ratioTarde: number;
  ratioNoche: number;
  maximaRatio: number;
  factorSensibilidad: number;
  modoMonitor: boolean;
  ninnosMonitor: string[]; // Un array de IDs de niños
}

// Define las props para el componente DatosProvider.
interface DatosProviderProps {
  children: React.ReactNode;
}

// Define la estructura del objeto de contexto que se expone a los consumidores.
interface DatosContextType {
  ratioMannana: number;
  setRatioMannana: React.Dispatch<React.SetStateAction<number>>;
  ratioMediodia: number;
  setRatioMediodia: React.Dispatch<React.SetStateAction<number>>;
  ratioTarde: number;
  setRatioTarde: React.Dispatch<React.SetStateAction<number>>;
  ratioNoche: number;
  setRatioNoche: React.Dispatch<React.SetStateAction<number>>;
  maximaRatio: number;
  setMaximaRatio: React.Dispatch<React.SetStateAction<number>>;
  factorSensibilidad: number;
  setFactorSensibilidad: React.Dispatch<React.SetStateAction<number>>;
  modoMonitor: boolean;
  setModoMonitor: React.Dispatch<React.SetStateAction<boolean>>;
  ninnos: Ninno[];
  cargandoNinnos: boolean;
  addNinno: (nuevoNinno: Omit<Ninno, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<string>;
  updateNinno: (id: string, datosActualizados: Partial<Ninno>) => Promise<void>;
  deleteNinno: (id: string) => Promise<void>;
  getNinnoById: (id: string) => Ninno | undefined;
  usuario1: string; // Si usuario1 se refiere a algo diferente al ID de Firebase Auth, asegúrate de su tipo
  setUsuario1: React.Dispatch<React.SetStateAction<string>>;
  usuarioId: string | null;
  ninnosMonitor: string[];
  setNinnosMonitor: React.Dispatch<React.SetStateAction<string[]>>;
  ninnosEnMonitor: Ninno[];
  activarModoMonitor: (ninnosSeleccionados: string[]) => Promise<void>;
  desactivarModoMonitor: () => Promise<void>;
  cargarNinnosMonitor: (uid: string) => Promise<void>;
}

// Se inicializa el contexto con null, pero se tipa que su valor puede ser DatosContextType o null.
export const DatosContext = createContext<DatosContextType | null>(null);

export function DatosProvider({ children }: DatosProviderProps) {
  // Estado para el ID del usuario (puede ser string o null)
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  // Estados para las ratios, factor de sensibilidad, etc.
  const [ratioMannana, setRatioMannana] = useState<number>(0);
  const [ratioMediodia, setRatioMediodia] = useState<number>(0);
  const [ratioTarde, setRatioTarde] = useState<number>(0);
  const [ratioNoche, setRatioNoche] = useState<number>(0);
  const [maximaRatio, setMaximaRatio] = useState<number>(4);
  const [factorSensibilidad, setFactorSensibilidad] = useState<number>(0);
  const [modoMonitor, setModoMonitor] = useState<boolean>(false);
  // Estados para listas de niños, tipados con la interfaz Ninno
  const [ninnos, setNinnos] = useState<Ninno[]>([]);
  const [ninnosMonitor, setNinnosMonitor] = useState<string[]>([]); // Solo IDs de niños
  const [ninnosEnMonitor, setNinnosEnMonitor] = useState<Ninno[]>([]); // Objetos completos de niños
  // Estado para usuario1 (asumido como string, ajusta si es otro tipo)
  const [usuario1, setUsuario1] = useState<string>("");
  // Estado para la carga de niños
  const [cargandoNinnos, setCargandoNinnos] = useState<boolean>(false);

  // Efecto para observar el estado de autenticación del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuarioId(user.uid);
        await cargarDatosUsuario(user.uid);
        await cargarNinnosUsuario(user.uid);
        await cargarNinnosMonitor(user.uid);
      } else {
        setUsuarioId(null);
        setNinnos([]);
        setNinnosMonitor([]);
        setNinnosEnMonitor([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para cargar los datos del usuario desde Firestore
  const cargarDatosUsuario = async (uid: string) => { // 'uid' es un string
    try {
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData; // Casteamos los datos a UserData
        setRatioMannana(data.ratioMannana ?? 0); // Usamos el operador nullish coalescing (??)
        setRatioMediodia(data.ratioMediodia ?? 0);
        setRatioTarde(data.ratioTarde ?? 0);
        setRatioNoche(data.ratioNoche ?? 0);
        setMaximaRatio(data.maximaRatio ?? 4);
        setFactorSensibilidad(data.factorSensibilidad ?? 0);
        setModoMonitor(data.modoMonitor ?? false);
        setNinnosMonitor(data.ninnosMonitor ?? []);
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    }
  };

  // Función para guardar los datos del usuario en Firestore
  const guardarDatosUsuario = async (datos: Partial<UserData>) => { // 'datos' es un objeto parcial de UserData
    if (!usuarioId) return;
    try {
      const docRef = doc(db, "usuarios", usuarioId);
      await setDoc(docRef, {
        ...datos,
        ninnosMonitor: modoMonitor ? ninnosMonitor : []
      }, { merge: true });
    } catch (error) {
      console.error("Error al guardar datos del usuario:", error);
    }
  };

  // Efecto para guardar automáticamente los datos del usuario cuando cambian ciertas variables de estado
  useEffect(() => {
    if (!usuarioId) return;
    guardarDatosUsuario({
      ratioMannana,
      ratioMediodia,
      ratioTarde,
      ratioNoche,
      maximaRatio,
      factorSensibilidad,
      modoMonitor,
      ninnosMonitor, // Asegúrate de que esto se guarde si quieres que persista en el documento del usuario
    });
  }, [
    usuarioId, // Añade usuarioId como dependencia aquí para asegurar que se guarde cuando el ID esté disponible
    ratioMannana,
    ratioMediodia,
    ratioTarde,
    ratioNoche,
    maximaRatio,
    factorSensibilidad,
    modoMonitor,
    ninnosMonitor,
  ]);

  // Función para cargar los niños asociados al usuario
  const cargarNinnosUsuario = async (uid: string) => {
    setCargandoNinnos(true);
    try {
      const ninnosRef = collection(db, "usuarios", uid, "ninnos");
      const snapshot = await getDocs(ninnosRef);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Ninno, 'id'>) // Casteamos los datos a Ninno (excluyendo el ID que ya viene del doc.id)
      }));

      setNinnos(data);
    } catch (error) {
      console.error("Error al cargar los niños:", error);
    } finally {
      setCargandoNinnos(false);
    }
  };

  // Función para cargar los niños que están en el modo monitor
  const cargarNinnosMonitor = async (uid: string) => {
    try {
      const monitorRef = collection(db, "usuarios", uid, "monitor");
      const snapshot = await getDocs(monitorRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Ninno, 'id'>)
      }));
      setNinnosEnMonitor(data);
    } catch (error) {
      console.error("Error al cargar niños en monitor:", error);
    }
  };

  // Función para añadir un nuevo niño
  const addNinno = async (nuevoNinno: Omit<Ninno, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<string> => {
    console.log("usuarioId:", usuarioId);
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede añadir niño.");
      throw new Error("Usuario no autenticado.");
    }
    try {
      const ninnosRef = collection(db, "usuarios", usuarioId, "ninnos");
      const ninnoConUsuario = {
        ...nuevoNinno,
        fechaCreacion: new Date().toISOString()
      };

      const docRef = await addDoc(ninnosRef, ninnoConUsuario);

      setNinnos([...ninnos, {
        id: docRef.id,
        ...ninnoConUsuario
      } as Ninno]); // Aseguramos que el tipo completo de Ninno

      return docRef.id;
    } catch (error) {
      console.error("Error al añadir niño:", error);
      throw error;
    }
  };

  // Función para actualizar los datos de un niño existente
  const updateNinno = async (id: string, datosActualizados: Partial<Ninno>): Promise<void> => {
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede actualizar niño.");
      throw new Error("Usuario no autenticado.");
    }
    try {
      const docRef = doc(db, "usuarios", usuarioId, "ninnos", id);
      await updateDoc(docRef, {
        ...datosActualizados,
        fechaActualizacion: new Date().toISOString()
      });

      setNinnos(ninnos.map(n =>
        n.id === id ? { ...n, ...datosActualizados } : n
      ) as Ninno[]); // Aseguramos el tipo completo de Ninno[]
    } catch (error) {
      console.error("Error al actualizar niño:", error);
      throw error;
    }
  };

  // Función para eliminar un niño
  const deleteNinno = async (id: string): Promise<void> => {
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede eliminar niño.");
      throw new Error("Usuario no autenticado.");
    }
    try {
      const docRef = doc(db, "usuarios", usuarioId, "ninnos", id);
      await deleteDoc(docRef);
      setNinnos(ninnos.filter(n => n.id !== id));
      setNinnosMonitor(ninnosMonitor.filter(ninnoId => ninnoId !== id));
      // También eliminar de ninnosEnMonitor si existe
      setNinnosEnMonitor(prevNinnosEnMonitor => prevNinnosEnMonitor.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar niño:", error);
      throw error;
    }
  };

  // Función para obtener un niño por su ID
  const getNinnoById = (id: string): Ninno | undefined => {
    return ninnos.find(n => n.id === id);
  };

  // Función para activar el modo monitor
  const activarModoMonitor = async (ninnosSeleccionados: string[]): Promise<void> => {
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede activar modo monitor.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      setModoMonitor(true);
      setNinnosMonitor(ninnosSeleccionados);

      // 1. Guardar en el documento usuario
      const docRef = doc(db, "usuarios", usuarioId);
      await setDoc(docRef, {
        modoMonitor: true,
        ninnosMonitor: ninnosSeleccionados
      }, { merge: true });

      // 2. Guardar en la subcolección monitor
      const monitorRef = collection(db, "usuarios", usuarioId, "monitor");

      // Limpiar subcolección existente
      const snapshot = await getDocs(monitorRef);
      await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));

      // Añadir nuevos niños al monitor
      const nuevosNinnosEnMonitor: Ninno[] = [];
      await Promise.all(ninnosSeleccionados.map(async (ninnoId) => {
        const ninno = getNinnoById(ninnoId);
        if (ninno) {
          // Asegúrate de que el ID del documento en la subcolección monitor sea el mismo que el ID del ninno original
          // Esto facilita la referencia y la eliminación
          await setDoc(doc(monitorRef, ninno.id), {
            ...ninno,
            fechaSeleccion: new Date().toISOString()
          });
          nuevosNinnosEnMonitor.push(ninno);
        }
      }));

      // Actualizar estado local
      setNinnosEnMonitor(nuevosNinnosEnMonitor);

    } catch (error) {
      console.error("Error al activar modo monitor:", error);
      throw error;
    }
  };

  // Función para desactivar el modo monitor
  const desactivarModoMonitor = async (): Promise<void> => {
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede desactivar modo monitor.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      setModoMonitor(false);
      setNinnosMonitor([]);
      setNinnosEnMonitor([]);

      // 1. Actualizar documento usuario
      const docRef = doc(db, "usuarios", usuarioId);
      await setDoc(docRef, {
        modoMonitor: false,
        ninnosMonitor: []
      }, { merge: true });

      // 2. Limpiar subcolección monitor
      const monitorRef = collection(db, "usuarios", usuarioId, "monitor");
      const snapshot = await getDocs(monitorRef);
      await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));

    } catch (error) {
      console.error("Error al desactivar modo monitor:", error);
      throw error;
    }
  };

  // Objeto de valor para el contexto, tipado como DatosContextType
  const value: DatosContextType = {
    ratioMannana,
    setRatioMannana,
    ratioMediodia,
    setRatioMediodia,
    ratioTarde,
    setRatioTarde,
    ratioNoche,
    setRatioNoche,
    maximaRatio,
    setMaximaRatio,
    factorSensibilidad,
    setFactorSensibilidad,
    modoMonitor,
    setModoMonitor,
    ninnos,
    cargandoNinnos,
    addNinno,
    updateNinno,
    deleteNinno,
    getNinnoById,
    usuario1,
    setUsuario1,
    usuarioId,
    ninnosMonitor,
    setNinnosMonitor,
    ninnosEnMonitor,
    activarModoMonitor,
    desactivarModoMonitor,
    cargarNinnosMonitor
  };

  return <DatosContext.Provider value={value}>{children}</DatosContext.Provider>;
}