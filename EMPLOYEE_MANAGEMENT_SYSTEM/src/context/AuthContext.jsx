import React, { createContext, useEffect, useState, useCallback } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { apiFetchEmployees } from '../services/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const refreshUserData = useCallback(async () => {
    const backendEmployees = await apiFetchEmployees();
    if (backendEmployees && Array.isArray(backendEmployees)) {
      setUserData(backendEmployees);
      localStorage.setItem('employees', JSON.stringify(backendEmployees));
    } else {
      const { employees } = getLocalStorage();
      setUserData(employees);
    }
  }, []);

  useEffect(() => {
    setLocalStorage();
    refreshUserData();
  }, [refreshUserData]);

  return (
    <AuthContext.Provider value={{ userData, setUserData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
