import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    active: { type: Boolean, default: false },
    newTask: { type: Boolean, default: true },
    completed: { type: Boolean, default: false },
    failed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const EmployeeSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    taskNumbers: {
      active: { type: Number, default: 0 },
      newTask: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    tasks: [TaskSchema],
  },
  { timestamps: true }
);

export const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
export default Employee;
