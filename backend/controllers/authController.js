import jwt from 'jsonwebtoken';
import { getAdminByEmail, getEmployeeByEmail, getEmployeeById } from '../data/store.js';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'ems_super_secret_jwt_key_2026', {
    expiresIn: '7d',
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Admin
    if (cleanEmail === 'admin@example.com' || cleanEmail === 'admin@me.com') {
      const admin = await getAdminByEmail(cleanEmail);
      if (admin && admin.password === password) {
        const token = generateToken({ id: admin.id, role: 'admin', email: admin.email });
        return res.json({
          success: true,
          role: 'admin',
          token,
          user: { id: admin.id, firstName: admin.firstName || 'Admin', email: admin.email },
        });
      }
    }

    // 2. Check Employee
    const employee = await getEmployeeByEmail(cleanEmail);
    if (employee && employee.password === password) {
      const token = generateToken({ id: employee.id, role: 'employee', email: employee.email });
      return res.json({
        success: true,
        role: 'employee',
        token,
        user: employee,
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({
        success: true,
        role: 'admin',
        user: { id: 1, firstName: 'Admin', email: req.user.email },
      });
    }

    const employee = await getEmployeeById(req.user.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.json({
      success: true,
      role: 'employee',
      user: employee,
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};
