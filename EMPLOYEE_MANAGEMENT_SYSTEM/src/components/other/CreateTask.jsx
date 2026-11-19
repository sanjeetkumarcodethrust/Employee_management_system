import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { apiCreateTask } from '../../services/api';

const CreateTask = () => {
  const { userData, setUserData, refreshUserData } = useContext(AuthContext);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [category, setCategory] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskDate || !assignTo.trim() || !category.trim() || !taskDescription.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    setIsSubmitting(true);

    const taskPayload = {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      date: taskDate,
      category: category.trim(),
      assignTo: assignTo.trim(),
    };

    // 1. Try backend API
    const apiRes = await apiCreateTask(taskPayload);

    if (apiRes && apiRes.success) {
      if (refreshUserData) {
        await refreshUserData();
      }
      setTaskTitle('');
      setTaskDate('');
      setAssignTo('');
      setCategory('');
      setTaskDescription('');
      setIsSubmitting(false);
      setStatusMessage({ type: 'success', text: `Task created and synced with backend for ${assignTo}!` });

      setTimeout(() => {
        setStatusMessage({ type: '', text: '' });
      }, 4000);
      return;
    }

    // 2. Fallback to local state if backend is offline
    const newTask = {
      title: taskPayload.title,
      description: taskPayload.description,
      date: taskPayload.date,
      category: taskPayload.category,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    };

    const employees = userData || [];
    let assigned = false;

    const updatedEmployees = employees.map((emp) => {
      const matchName = emp.firstName.toLowerCase() === assignTo.trim().toLowerCase();
      const matchEmail = emp.email.toLowerCase() === assignTo.trim().toLowerCase();

      if (matchName || matchEmail) {
        assigned = true;
        const currentTasks = emp.tasks || [];
        const currentNumbers = emp.taskNumbers || { active: 0, newTask: 0, completed: 0, failed: 0 };

        return {
          ...emp,
          tasks: [...currentTasks, newTask],
          taskNumbers: {
            ...currentNumbers,
            newTask: (currentNumbers.newTask || 0) + 1,
          },
        };
      }
      return emp;
    });

    setIsSubmitting(false);

    if (!assigned) {
      const availableNames = employees.map((e) => e.firstName).join(', ');
      setStatusMessage({
        type: 'error',
        text: `Employee "${assignTo}" not found. Available: ${availableNames || 'None'}`,
      });
      return;
    }

    setUserData(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setTaskTitle('');
    setTaskDate('');
    setAssignTo('');
    setCategory('');
    setTaskDescription('');
    setStatusMessage({ type: 'success', text: `Task assigned locally to ${assignTo}!` });

    setTimeout(() => {
      setStatusMessage({ type: '', text: '' });
    }, 4000);
  };

  const employees = userData || [];

  return (
    <div className='bg-[#1c1c1c] p-7 rounded-2xl mt-6 border border-gray-800 shadow-xl'>
      <div className='flex items-center justify-between mb-5'>
        <div>
          <h2 className='text-2xl font-bold text-white'>Create New Task</h2>
          <p className='text-xs text-gray-400 mt-1'>
            Fill in the details below to assign a new task to any team member.
          </p>
        </div>
        {statusMessage.text && (
          <div
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              statusMessage.type === 'error'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>

      <form onSubmit={submitHandler} className='flex flex-wrap items-start justify-between gap-6'>
        <div className='w-full lg:w-[48%] space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5'>
              Task Title
            </label>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className='w-full text-sm py-2.5 px-4 rounded-xl outline-none bg-[#282828] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 transition-all'
              type='text'
              placeholder='e.g., Build Authentication Flow'
              required
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5'>
              Due Date
            </label>
            <input
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className='w-full text-sm py-2.5 px-4 rounded-xl outline-none bg-[#282828] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all cursor-pointer'
              type='date'
              required
            />
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5'>
              Assign To (Employee)
            </label>
            <input
              list='employee-options'
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className='w-full text-sm py-2.5 px-4 rounded-xl outline-none bg-[#282828] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 transition-all'
              type='text'
              placeholder='Choose or type employee name (e.g., Aarav)'
              required
            />
            <datalist id='employee-options'>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.firstName}>
                  {emp.firstName} ({emp.email})
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5'>
              Category
            </label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full text-sm py-2.5 px-4 rounded-xl outline-none bg-[#282828] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 transition-all'
              type='text'
              placeholder='Design, Dev, Marketing, etc.'
              required
            />
          </div>
        </div>

        <div className='w-full lg:w-[48%] flex flex-col justify-between h-full space-y-4'>
          <div>
            <label className='block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5'>
              Task Description
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={8}
              className='w-full text-sm p-4 rounded-xl outline-none bg-[#282828] border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500 resize-none transition-all'
              placeholder='Provide detailed specifications, requirements, and scope...'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all text-white font-semibold py-3 px-6 rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50'
          >
            <span>+</span> {isSubmitting ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
