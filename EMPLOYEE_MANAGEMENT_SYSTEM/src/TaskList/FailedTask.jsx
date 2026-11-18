import React from 'react';

const FailedTask = ({ data }) => {
  return (
    <div className='flex-shrink-0 h-full w-[320px] p-5 bg-rose-600/90 rounded-2xl flex flex-col justify-between shadow-lg border border-rose-500/30'>
      <div>
        <div className='flex justify-between items-center'>
          <span className='bg-red-800 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider'>
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
          disabled
          className='w-full bg-rose-800/80 text-white py-2 px-4 text-sm font-semibold rounded-lg shadow cursor-default flex items-center justify-center gap-1.5'
        >
          ✕ Failed
        </button>
      </div>
    </div>
  );
};

export default FailedTask;
