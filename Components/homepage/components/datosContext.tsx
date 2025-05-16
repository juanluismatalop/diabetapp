// contexto/datosContext.js
import React, { createContext, useState } from 'react';

export const DatosContext = createContext();

export function DatosProvider({ children }) {
  const [ratioMannana, setRatioMannana] = useState(0);
  const [ratioMediodia, setRatioMediodia] = useState(0);
  const [ratioTarde, setRatioTarde] = useState(0);
  const [ratioNoche, setRatioNoche] = useState(0);
  const [factordesensibilidad, setFactordesensibilidad] = useState(0);

  return (
    <DatosContext.Provider
      value={{
        ratioMannana,
        setRatioMannana,
        ratioMediodia,
        setRatioMediodia,
        ratioTarde,
        setRatioTarde,
        ratioNoche,
        setRatioNoche,
        factordesensibilidad,
        setFactordesensibilidad
      }}
    >
      {children}
    </DatosContext.Provider>
  );
}
