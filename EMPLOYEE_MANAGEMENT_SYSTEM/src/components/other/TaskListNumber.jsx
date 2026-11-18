import React from 'react';

const TaskListNumber = ({ data }) => {
  const newTaskCount = data?.taskNumbers?.newTask ?? 0;
  const activeCount = data?.taskNumbers?.active ?? 0;
  const completedCount = data?.taskNumbers?.completed ?? 0;
  const failedCount = data?.taskNumbers?.failed ?? 0;

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8'>
      <div className='rounded-2xl py-6 px-7 bg-blue-600 shadow-md border border-blue-500/30 flex flex-col justify-between'>
        <h2 className='text-3xl font-extrabold text-white'>{newTaskCount}</h2>
        <h3 className='text-lg font-semibold text-blue-100 mt-2'>New Tasks</h3>
      </div>
      <div className='rounded-2xl py-6 px-7 bg-amber-600 shadow-md border border-amber-500/30 flex flex-col justify-between'>
        <h2 className='text-3xl font-extrabold text-white'>{activeCount}</h2>
        <h3 className='text-lg font-semibold text-amber-100 mt-2'>Accepted / Active</h3>
      </div>
      <div className='rounded-2xl py-6 px-7 bg-emerald-600 shadow-md border border-emerald-500/30 flex flex-col justify-between'>
        <h2 className='text-3xl font-extrabold text-white'>{completedCount}</h2>
        <h3 className='text-lg font-semibold text-emerald-100 mt-2'>Completed</h3>
      </div>
      <div className='rounded-2xl py-6 px-7 bg-rose-600 shadow-md border border-rose-500/30 flex flex-col justify-between'>
        <h2 className='text-3xl font-extrabold text-white'>{failedCount}</h2>
        <h3 className='text-lg font-semibold text-rose-100 mt-2'>Failed</h3>
      </div>
    </div>
  );
};

export default TaskListNumber;
