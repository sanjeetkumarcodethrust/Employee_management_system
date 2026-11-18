import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AllTask = () => {
  const authData = useContext(AuthContext);
  const employees = authData?.userData || [];

  return (
    <div className='bg-[#1c1c1c] p-6 rounded-2xl mt-6 border border-gray-800 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold text-white'>Team Overview</h2>
        <span className='text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full'>
          Total Employees: {employees.length}
        </span>
      </div>

      <div className='bg-red-600/90 py-3 px-4 flex justify-between rounded-xl mb-3 text-sm font-semibold tracking-wide uppercase text-white shadow-sm'>
        <h3 className='w-1/5 text-left'>Employee</h3>
        <h4 className='w-1/5 text-center'>New Task</h4>
        <h4 className='w-1/5 text-center'>Active</h4>
        <h4 className='w-1/5 text-center'>Completed</h4>
        <h4 className='w-1/5 text-center'>Failed</h4>
      </div>

      <div className='space-y-2.5 max-h-[280px] overflow-y-auto pr-1'>
        {employees.length === 0 ? (
          <p className='text-center py-6 text-gray-500 text-sm'>No employees found.</p>
        ) : (
          employees.map((elem, idx) => (
            <div
              key={idx}
              className='border border-emerald-500/30 bg-[#252525] hover:bg-[#2c2c2c] transition-colors py-3 px-4 flex justify-between items-center rounded-xl text-sm'
            >
              <div className='w-1/5 text-left'>
                <p className='font-bold text-white'>{elem.firstName}</p>
                <p className='text-xs text-gray-400 truncate'>{elem.email}</p>
              </div>
              <h4 className='w-1/5 text-center font-bold text-blue-400'>
                {elem.taskNumbers?.newTask ?? 0}
              </h4>
              <h4 className='w-1/5 text-center font-bold text-amber-400'>
                {elem.taskNumbers?.active ?? 0}
              </h4>
              <h4 className='w-1/5 text-center font-bold text-emerald-400'>
                {elem.taskNumbers?.completed ?? 0}
              </h4>
              <h4 className='w-1/5 text-center font-bold text-rose-400'>
                {elem.taskNumbers?.failed ?? 0}
              </h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllTask;
