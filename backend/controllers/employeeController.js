import { getEmployees, getEmployeeById } from '../data/store.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await getEmployees();
    return res.json({ success: true, count: employees.length, employees });
  } catch (error) {
    console.error('getAllEmployees error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving employees' });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    return res.json({ success: true, employee });
  } catch (error) {
    console.error('getEmployee error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving employee' });
  }
};
