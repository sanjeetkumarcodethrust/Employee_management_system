import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { initialEmployees, initialAdmin } from './initialData.js';
import Employee from '../models/Employee.js';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const employeesFilePath = path.join(__dirname, 'employees.json');
const adminFilePath = path.join(__dirname, 'admin.json');

const isMongoActive = () => mongoose.connection.readyState === 1;

// Helper to read file store
const readFileJSON = (filePath, fallback) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
  return fallback;
};

// Helper to write file store
const writeFileJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

export const initStore = async () => {
  // Always prepare file store first
  readFileJSON(employeesFilePath, initialEmployees);
  readFileJSON(adminFilePath, initialAdmin);
  console.log('[Store] Initialized persistent JSON storage');

  if (isMongoActive()) {
    try {
      const empCount = await Employee.countDocuments();
      if (empCount === 0) {
        await Employee.insertMany(initialEmployees);
        console.log('[Store] Seeded initial employees into MongoDB');
      }

      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        await Admin.insertMany(initialAdmin);
        console.log('[Store] Seeded initial admin into MongoDB');
      }
    } catch (err) {
      console.error('[Store] Error seeding MongoDB:', err);
    }
  }
};

export const getEmployees = async () => {
  if (isMongoActive()) {
    return await Employee.find().lean();
  }
  return readFileJSON(employeesFilePath, initialEmployees);
};

export const getEmployeeById = async (id) => {
  const numericId = Number(id);
  if (isMongoActive()) {
    return await Employee.findOne({ id: numericId }).lean();
  }
  const employees = readFileJSON(employeesFilePath, initialEmployees);
  return employees.find((emp) => emp.id === numericId) || null;
};

export const getEmployeeByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();
  if (isMongoActive()) {
    return await Employee.findOne({ email: normalized }).lean();
  }
  const employees = readFileJSON(employeesFilePath, initialEmployees);
  return employees.find((emp) => emp.email.toLowerCase() === normalized) || null;
};

export const getAdminByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();
  if (isMongoActive()) {
    return await Admin.findOne({ email: normalized }).lean();
  }
  const admins = readFileJSON(adminFilePath, initialAdmin);
  return admins.find((adm) => adm.email.toLowerCase() === normalized) || null;
};

export const assignTaskToEmployee = async ({ assignTo, task }) => {
  const query = assignTo.trim().toLowerCase();

  if (isMongoActive()) {
    const employee = await Employee.findOne({
      $or: [
        { firstName: { $regex: new RegExp(`^${query}$`, 'i') } },
        { email: query },
      ],
    });

    if (!employee) return null;

    employee.tasks.push(task);
    employee.taskNumbers.newTask = (employee.taskNumbers.newTask || 0) + 1;
    await employee.save();
    return employee.toObject();
  }

  const employees = readFileJSON(employeesFilePath, initialEmployees);
  let updated = null;

  const modifiedEmployees = employees.map((emp) => {
    const matchName = emp.firstName.toLowerCase() === query;
    const matchEmail = emp.email.toLowerCase() === query;

    if (matchName || matchEmail) {
      const currentTasks = emp.tasks || [];
      const currentNumbers = emp.taskNumbers || { active: 0, newTask: 0, completed: 0, failed: 0 };
      const updatedEmp = {
        ...emp,
        tasks: [...currentTasks, task],
        taskNumbers: {
          ...currentNumbers,
          newTask: (currentNumbers.newTask || 0) + 1,
        },
      };
      updated = updatedEmp;
      return updatedEmp;
    }
    return emp;
  });

  if (updated) {
    writeFileJSON(employeesFilePath, modifiedEmployees);
  }
  return updated;
};

export const updateTaskStatus = async (employeeId, taskIndex, nextStatus) => {
  const numericId = Number(employeeId);
  const idx = Number(taskIndex);

  if (isMongoActive()) {
    const employee = await Employee.findOne({ id: numericId });
    if (!employee || !employee.tasks[idx]) return null;

    const task = employee.tasks[idx];
    if (nextStatus === 'active' && task.newTask) {
      task.newTask = false;
      task.active = true;
      employee.taskNumbers.newTask = Math.max(0, (employee.taskNumbers.newTask || 0) - 1);
      employee.taskNumbers.active = (employee.taskNumbers.active || 0) + 1;
    } else if (nextStatus === 'completed' && task.active) {
      task.active = false;
      task.completed = true;
      employee.taskNumbers.active = Math.max(0, (employee.taskNumbers.active || 0) - 1);
      employee.taskNumbers.completed = (employee.taskNumbers.completed || 0) + 1;
    } else if (nextStatus === 'failed' && task.active) {
      task.active = false;
      task.failed = true;
      employee.taskNumbers.active = Math.max(0, (employee.taskNumbers.active || 0) - 1);
      employee.taskNumbers.failed = (employee.taskNumbers.failed || 0) + 1;
    }

    await employee.save();
    return employee.toObject();
  }

  const employees = readFileJSON(employeesFilePath, initialEmployees);
  let updated = null;

  const modifiedEmployees = employees.map((emp) => {
    if (emp.id === numericId) {
      const tasks = [...(emp.tasks || [])];
      if (!tasks[idx]) return emp;

      const task = { ...tasks[idx] };
      const taskNumbers = {
        ...(emp.taskNumbers || { active: 0, newTask: 0, completed: 0, failed: 0 }),
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

      tasks[idx] = task;
      const updatedEmp = { ...emp, tasks, taskNumbers };
      updated = updatedEmp;
      return updatedEmp;
    }
    return emp;
  });

  if (updated) {
    writeFileJSON(employeesFilePath, modifiedEmployees);
  }
  return updated;
};
