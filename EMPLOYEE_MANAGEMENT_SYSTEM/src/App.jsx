import React, { useContext, useEffect, useState } from 'react';
import Login from './components/Auth/Login';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    if (loggedInUserStr) {
      try {
        const storedUser = JSON.parse(loggedInUserStr);
        if (storedUser && storedUser.role === 'admin') {
          setUser('admin');
        } else if (storedUser && storedUser.role === 'employee') {
          setUser('employee');
          setLoggedInUserData(storedUser.data);
        }
      } catch (err) {
        console.error('Failed to parse loggedInUser from localStorage', err);
        localStorage.removeItem('loggedInUser');
      }
    }
  }, []);

  const handleLogin = (email, password) => {
    // Admin login check
    if (
      (email === 'admin@me.com' || email === 'admin@example.com') &&
      password === '123'
    ) {
      setUser('admin');
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }));
      return true;
    }

    // Employee login check
    if (userData && Array.isArray(userData)) {
      const employee = userData.find(
        (emp) => emp.email === email && emp.password === password
      );
      if (employee) {
        setUser('employee');
        setLoggedInUserData(employee);
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({ role: 'employee', data: employee })
        );
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {!user && <Login handleLogin={handleLogin} />}
      {user === 'admin' && <AdminDashboard changeUser={setUser} />}
      {user === 'employee' && (
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
      )}
    </>
  );
};

export default App;
