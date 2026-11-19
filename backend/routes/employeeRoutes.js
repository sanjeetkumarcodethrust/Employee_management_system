import express from 'express';
import { getAllEmployees, getEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', getAllEmployees);
router.get('/:id', getEmployee);

export default router;
