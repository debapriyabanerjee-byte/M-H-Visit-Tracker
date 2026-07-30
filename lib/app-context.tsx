"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "@/services/storage";
import type { Employee } from "@/types";

interface AppContextValue {
  employee: Employee | null;
  setEmployee: (e: Employee) => void;
  clearEmployee: () => void;
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployeeState] = useState<Employee | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEmployeeState(storage.getEmployee());
    setHydrated(true);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      employee,
      hydrated,
      setEmployee: (e: Employee) => {
        storage.setEmployee(e);
        setEmployeeState(e);
      },
      clearEmployee: () => {
        storage.clearEmployee();
        setEmployeeState(null);
      },
    }),
    [employee, hydrated],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
