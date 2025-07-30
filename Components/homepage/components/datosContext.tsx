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
import { db, auth } from "../../../firebase/firebase";

interface Ninno {
  id: string;
  nombre: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

interface UserData {
  ratioMannana: number;
  ratioMediodia: number;
  ratioTarde: number;
  ratioNoche: number;
  maximaRatio: number;
  factorSensibilidad: number;
  modoMonitor: boolean;
  ninnosMonitor: string[];
  empezarCorregir?: number;
}


interface DatosProviderProps {
  children: React.ReactNode;
}

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
  usuario1: string; 
  setUsuario1: React.Dispatch<React.SetStateAction<string>>;
  usuarioId: string | null;
  ninnosMonitor: string[];
  setNinnosMonitor: React.Dispatch<React.SetStateAction<string[]>>;
  ninnosEnMonitor: Ninno[];
  activarModoMonitor: (ninnosSeleccionados: string[]) => Promise<void>;
  desactivarModoMonitor: () => Promise<void>;
  cargarNinnosMonitor: (uid: string) => Promise<void>;
  empezarCorregir: number;
  setEmpezarCorregir: React.Dispatch<React.SetStateAction<number>>;

}

export const DatosContext = createContext<DatosContextType | null>(null);

export function DatosProvider({ children }: DatosProviderProps) {
  const [empezarCorregir, setEmpezarCorregir] = useState(150)
  const [datosCargados, setDatosCargados] = useState(false);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [ratioMannana, setRatioMannana] = useState<number>(0);
  const [ratioMediodia, setRatioMediodia] = useState<number>(0);
  const [ratioTarde, setRatioTarde] = useState<number>(0);
  const [ratioNoche, setRatioNoche] = useState<number>(0);
  const [maximaRatio, setMaximaRatio] = useState<number>(4);
  const [factorSensibilidad, setFactorSensibilidad] = useState<number>(0);
  const [modoMonitor, setModoMonitor] = useState<boolean>(false);
  const [ninnos, setNinnos] = useState<Ninno[]>([]);
  const [ninnosMonitor, setNinnosMonitor] = useState<string[]>([]); 
  const [ninnosEnMonitor, setNinnosEnMonitor] = useState<Ninno[]>([]); 
  const [usuario1, setUsuario1] = useState<string>("");
  const [cargandoNinnos, setCargandoNinnos] = useState<boolean>(false);

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

  const cargarDatosUsuario = async (uid: string) => {
  try {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as UserData;
      setRatioMannana(data.ratioMannana ?? 0);
      setRatioMediodia(data.ratioMediodia ?? 0);
      setRatioTarde(data.ratioTarde ?? 0);
      setRatioNoche(data.ratioNoche ?? 0);
      setMaximaRatio(data.maximaRatio ?? 4);
      setFactorSensibilidad(data.factorSensibilidad ?? 0);
      setModoMonitor(data.modoMonitor ?? false);
      setNinnosMonitor(data.ninnosMonitor ?? []);
      setEmpezarCorregir(data.empezarCorregir ?? 150); // 👈 Aquí
    }
  } catch (error) {
    console.error("Error al cargar datos del usuario:", error);
  } finally {
    setDatosCargados(true);
  }
};


  const guardarDatosUsuario = async (datos: Partial<UserData>) => {
  if (!usuarioId) return;
  try {
    const docRef = doc(db, "usuarios", usuarioId);
    await setDoc(
      docRef,
      {
        ...datos,
        ninnosMonitor: modoMonitor ? ninnosMonitor : [],
        empezarCorregir, // 👈 Aquí
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error al guardar datos del usuario:", error);
  }
};

  useEffect(() => {
  if (!usuarioId || !datosCargados) return;

  guardarDatosUsuario({
    ratioMannana,
    ratioMediodia,
    ratioTarde,
    ratioNoche,
    maximaRatio,
    factorSensibilidad,
    modoMonitor,
    ninnosMonitor,
    empezarCorregir, // 👈 Aquí
  });
}, [
  usuarioId,
  datosCargados,
  ratioMannana,
  ratioMediodia,
  ratioTarde,
  ratioNoche,
  maximaRatio,
  factorSensibilidad,
  modoMonitor,
  ninnosMonitor,
  empezarCorregir, // 👈 Aquí
]);


  const cargarNinnosUsuario = async (uid: string) => {
    setCargandoNinnos(true);
    try {
      const ninnosRef = collection(db, "usuarios", uid, "ninnos");
      const snapshot = await getDocs(ninnosRef);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Ninno, 'id'>)
      }));

      setNinnos(data);
    } catch (error) {
      console.error("Error al cargar los niños:", error);
    } finally {
      setCargandoNinnos(false);
    }
  };

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
      } as Ninno]); 

      return docRef.id;
    } catch (error) {
      console.error("Error al añadir niño:", error);
      throw error;
    }
  };

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
      ) as Ninno[]); 
    } catch (error) {
      console.error("Error al actualizar niño:", error);
      throw error;
    }
  };

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
      setNinnosEnMonitor(prevNinnosEnMonitor => prevNinnosEnMonitor.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar niño:", error);
      throw error;
    }
  };

  const getNinnoById = (id: string): Ninno | undefined => {
    return ninnos.find(n => n.id === id);
  };

  const activarModoMonitor = async (ninnosSeleccionados: string[]): Promise<void> => {
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede activar modo monitor.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      setModoMonitor(true);
      setNinnosMonitor(ninnosSeleccionados);

      const docRef = doc(db, "usuarios", usuarioId);
      await setDoc(docRef, {
        modoMonitor: true,
        ninnosMonitor: ninnosSeleccionados
      }, { merge: true });

      const monitorRef = collection(db, "usuarios", usuarioId, "monitor");

      const snapshot = await getDocs(monitorRef);
      await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));

      const nuevosNinnosEnMonitor: Ninno[] = [];
      await Promise.all(ninnosSeleccionados.map(async (ninnoId) => {
        const ninno = getNinnoById(ninnoId);
        if (ninno) {
          await setDoc(doc(monitorRef, ninno.id), {
            ...ninno,
            fechaSeleccion: new Date().toISOString()
          });
          nuevosNinnosEnMonitor.push(ninno);
        }
      }));

      setNinnosEnMonitor(nuevosNinnosEnMonitor);

    } catch (error) {
      console.error("Error al activar modo monitor:", error);
      throw error;
    }
  };

  const desactivarModoMonitor = async (): Promise<void> => {
    if (!usuarioId) {
      console.error("usuarioId no disponible. No se puede desactivar modo monitor.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      setModoMonitor(false);
      setNinnosMonitor([]);
      setNinnosEnMonitor([]);

      const docRef = doc(db, "usuarios", usuarioId);
      await setDoc(docRef, {
        modoMonitor: false,
        ninnosMonitor: []
      }, { merge: true });

      const monitorRef = collection(db, "usuarios", usuarioId, "monitor");
      const snapshot = await getDocs(monitorRef);
      await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));

    } catch (error) {
      console.error("Error al desactivar modo monitor:", error);
      throw error;
    }
  };

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
  cargarNinnosMonitor,
  empezarCorregir,            
  setEmpezarCorregir          
};


  return <DatosContext.Provider value={value}>{children}</DatosContext.Provider>;
}