import React, { createContext, useState } from 'react';

export const DatosContext = createContext(null);

export function DatosProvider({ children }) {
  const [ratioMannana, setRatioMannana] = useState(0);
  const [ratioMediodia, setRatioMediodia] = useState(0);
  const [ratioTarde, setRatioTarde] = useState(0);
  const [ratioNoche, setRatioNoche] = useState(0);
  const [factorSensibilidad, setFactorSensibilidad] = useState(0);

  const value = {
    ratioMannana,
    setRatioMannana,
    ratioMediodia,
    setRatioMediodia,
    ratioTarde,
    setRatioTarde,
    ratioNoche,
    setRatioNoche,
    factorSensibilidad,
    setFactorSensibilidad
  };

  return (
    <DatosContext.Provider value={value}>
      {children}
    </DatosContext.Provider>
  );
}
