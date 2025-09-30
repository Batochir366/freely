"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ScanContextType {
  scanned: boolean;
  setScanned: (value: boolean) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider = ({ children }: { children: ReactNode }) => {
  const [scanned, setScanned] = useState(false);

  return (
    <ScanContext.Provider value={{ scanned, setScanned }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = (): ScanContextType => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScan must be used within a ScanProvider");
  }
  return context;
};
