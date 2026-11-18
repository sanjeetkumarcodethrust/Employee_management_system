import React, { useContext, useEffect, useState } from 'react';
import Header from '../other/Header';
import TaskListNumber from '../other/TaskListNumber';
import TaskList from '../../TaskList/TaskList';
import { AuthContext } from '../../context/AuthContext';

const EmployeeDashboard = ({ data, changeUser }) => {
  const { userData, setUserData } = useContext(AuthContext);
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

  const handleUpdateStatus = (taskIndex, nextStatus) => {
    if (!employeeData) return;

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

    // Update global context & local storage
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
