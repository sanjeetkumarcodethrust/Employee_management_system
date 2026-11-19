import React, { useContext, useEffect, useState } from 'react';
import Login from './components/Auth/Login';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { AuthContext } from './context/AuthContext';
import { apiLogin } from './services/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const { userData, refreshUserData } = useContext(AuthContext);

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

  const handleLogin = async (email, password) => {
    // 1. Try Backend API login
    const apiResult = await apiLogin(email, password);

    if (apiResult && apiResult.success) {
      if (apiResult.role === 'admin') {
        setUser('admin');
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({ role: 'admin', user: apiResult.user })
        );
        refreshUserData();
        return true;
      }

      if (apiResult.role === 'employee') {
        setUser('employee');
        setLoggedInUserData(apiResult.user);
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({ role: 'employee', data: apiResult.user })
        );
        refreshUserData();
        return true;
      }
    }

    // If backend returned explicit authentication error
    if (apiResult && !apiResult.networkError && apiResult.message) {
      return false;
    }

    // 2. Fallback to local authentication if backend is offline
    if (
      (email === 'admin@me.com' || email === 'admin@example.com') &&
      password === '123'
    ) {
      setUser('admin');
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }));
      return true;
    }

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
