'use client';

import React, { createContext, useContext, useState } from "react";

// Define types for the context
type NavigationContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

// Create the context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Context Provider
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>("home");

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook to use the navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
