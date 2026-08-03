import React from 'react';

const Header = () => {
  return (
    <div className='flex items-end justify-between' >
    <h1 className='text-2xl font-semibold'>Hello <br /><span className='text-3xl font-bold'>Sanjeet 👋👋</span> </h1>
    <button className='bg-red-500 text-white p-2 rounded-full hover:bg-red-600' >Log Out</button>
    </div>
  );
}

export default Header;
