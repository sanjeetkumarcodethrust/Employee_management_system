import React, { useContext, useEffect, useState } from 'react';
import Header from '../other/Header';
import TaskListNumber from '../other/TaskListNumber';
import TaskList from '../../TaskList/TaskList';
import { AuthContext } from '../../context/AuthContext';
import { apiUpdateTaskStatus } from '../../services/api';

const EmployeeDashboard = ({ data, changeUser }) => {
  const { userData, setUserData, refreshUserData } = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState(data);

  // Keep employeeData synchronized with latest userData or incoming data prop
  useEffect(() => {
    if (userData && employeeData?.id) {
      const updated = userData.find((emp) => emp.id === employeeData.id);
      if (updated) {
        setEmployeeData(updated);
      }
    } else if (data) {
      setEmployeeData(data);
    }
  }, [userData, data, employeeData?.id]);

  const handleUpdateStatus = async (taskIndex, nextStatus) => {
    if (!employeeData) return;

    // 1. Try Backend API
    const apiRes = await apiUpdateTaskStatus(employeeData.id, taskIndex, nextStatus);

    if (apiRes && apiRes.success && apiRes.employee) {
      setEmployeeData(apiRes.employee);
      if (refreshUserData) {
        await refreshUserData();
      }
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ role: 'employee', data: apiRes.employee })
      );
      return;
    }

    // 2. Fallback to local update if backend offline
    const tasks = [...(employeeData.tasks || [])];
    const task = { ...tasks[taskIndex] };
    const taskNumbers = {
      ...(employeeData.taskNumbers || { active: 0, newTask: 0, completed: 0, failed: 0 }),
    };

    if (nextStatus === 'active' && task.newTask) {
      task.newTask = false;
      task.active = true;
      taskNumbers.newTask = Math.max(0, (taskNumbers.newTask || 0) - 1);
      taskNumbers.active = (taskNumbers.active || 0) + 1;
    } else if (nextStatus === 'completed' && task.active) {
      task.active = false;
      task.completed = true;
      taskNumbers.active = Math.max(0, (taskNumbers.active || 0) - 1);
      taskNumbers.completed = (taskNumbers.completed || 0) + 1;
    } else if (nextStatus === 'failed' && task.active) {
      task.active = false;
      task.failed = true;
      taskNumbers.active = Math.max(0, (taskNumbers.active || 0) - 1);
      taskNumbers.failed = (taskNumbers.failed || 0) + 1;
    }

    tasks[taskIndex] = task;

    const updatedEmployee = {
      ...employeeData,
      tasks,
      taskNumbers,
    };

    setEmployeeData(updatedEmployee);

    if (userData) {
      const updatedAll = userData.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      setUserData(updatedAll);
      localStorage.setItem('employees', JSON.stringify(updatedAll));
    }

    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({ role: 'employee', data: updatedEmployee })
    );
  };

  return (
    <div className='p-6 md:p-10 bg-[#121212] min-h-screen text-white flex flex-col justify-start'>
      <Header data={employeeData} changeUser={changeUser} />
      <TaskListNumber data={employeeData} />
      <TaskList data={employeeData} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
};

export default EmployeeDashboard;
