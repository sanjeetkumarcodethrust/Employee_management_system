import { assignTaskToEmployee, updateTaskStatus } from '../data/store.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, date, category, assignTo } = req.body;

    if (!title || !description || !date || !category || !assignTo) {
      return res.status(400).json({
        success: false,
        message: 'All fields (title, description, date, category, assignTo) are required',
      });
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      date,
      category: category.trim(),
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    };

    const updatedEmployee = await assignTaskToEmployee({
      assignTo: assignTo.trim(),
      task: newTask,
    });

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: `Employee "${assignTo}" could not be found.`,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Task assigned successfully',
      task: newTask,
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error('createTask error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { employeeId, taskIndex, nextStatus } = req.body;

    if (employeeId === undefined || taskIndex === undefined || !nextStatus) {
      return res.status(400).json({
        success: false,
        message: 'employeeId, taskIndex, and nextStatus are required',
      });
    }

    if (!['active', 'completed', 'failed'].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "nextStatus must be one of 'active', 'completed', 'failed'",
      });
    }

    const updatedEmployee = await updateTaskStatus(employeeId, taskIndex, nextStatus);

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee or specified task not found',
      });
    }

    return res.json({
      success: true,
      message: `Task status updated to ${nextStatus}`,
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error('updateStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating task status' });
  }
};
