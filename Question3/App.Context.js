import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [savedServices, setSavedServices] = useState([]);
    const [preference, setPreference] = useState("Light"); // shared app-wide preference

 
  // 3.4 Persist and restore saved services
  //Load saved data on startup
 
  useEffect(() => {
    async function loadData() {
      try {
        const saved = await AsyncStorage.getItem("@savedServices");
        const pref = await AsyncStorage.getItem("@preference");
        if (saved) setSavedServices(JSON.parse(saved));
        if (pref) setPreference(pref);
      } catch (e) {
        console.log("Restore error", e);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@savedServices", JSON.stringify(savedServices)).catch(console.log);
  }, [savedServices]);

  useEffect(() => {
    AsyncStorage.setItem("@preference", preference).catch(console.log);
  }, [preference]);


  // 3.1 Context-based state layer
 
  function addSavedService(service) {
    setSavedServices(prev => {
      if (prev.find(s => s.id === service.id)) return prev; // 3.3 prevent duplicates
      return [...prev, service];
    });
  }

  function removeSavedService(id) {
    setSavedServices(prev => prev.filter(s => s.id !== id));
  }

  return (
    <AppContext.Provider
      value={{ savedServices, addSavedService, removeSavedService, preference, setPreference }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
