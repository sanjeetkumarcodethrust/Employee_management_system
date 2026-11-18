import React from 'react';

const Header = ({ data, changeUser }) => {
  const userName = data?.firstName || 'Admin';

  const logOutUser = () => {
    localStorage.setItem('loggedInUser', '');
    if (changeUser) {
      changeUser('');
    }
  };

  return (
    <div className='flex items-center justify-between pb-4 border-b border-gray-800/80'>
      <div>
        <span className='text-sm uppercase tracking-wider text-gray-400 font-medium'>
          Welcome back
        </span>
        <h1 className='text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 mt-0.5'>
          {userName} <span className='text-2xl animate-pulse'>👋</span>
        </h1>
      </div>
      <button
        onClick={logOutUser}
        className='bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-medium px-5 py-2.5 rounded-xl shadow-md text-sm cursor-pointer'
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
