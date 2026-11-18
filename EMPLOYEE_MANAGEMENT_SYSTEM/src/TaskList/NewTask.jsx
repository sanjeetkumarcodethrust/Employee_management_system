import React from 'react';

const NewTask = ({ data, index, onUpdateStatus }) => {
  return (
    <div className='flex-shrink-0 h-full w-[320px] p-5 bg-blue-600/90 rounded-2xl flex flex-col justify-between shadow-lg border border-blue-500/30'>
      <div>
        <div className='flex justify-between items-center'>
          <span className='bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider'>
            {data?.category || 'General'}
          </span>
          <span className='text-sm text-gray-200 font-medium'>{data?.date}</span>
        </div>
        <h2 className='text-2xl font-bold mt-5 line-clamp-2 text-white'>{data?.title}</h2>
        <p className='text-sm text-gray-100 mt-3 line-clamp-4 leading-relaxed'>
          {data?.description}
        </p>
      </div>

      <div className='mt-6'>
        <button
          onClick={() => onUpdateStatus && onUpdateStatus(index, 'active')}
          className='w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white py-2 px-4 text-sm font-semibold rounded-lg shadow cursor-pointer'
        >
          Accept Task
        </button>
      </div>
    </div>
  );
};

export default NewTask;
