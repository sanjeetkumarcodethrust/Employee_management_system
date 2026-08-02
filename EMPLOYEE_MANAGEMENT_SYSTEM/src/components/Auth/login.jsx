import React from 'react'

const login = () => {
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("form submitted");
  }
  return (
    <div className='flex h-screen w-screen items-center justify-center '>
       <div className= 'border-2 border-red-600'>
        <form  onSubmit={(e)=>{
          submitHandler(e)
        }} className='flex flex-col items-center justify-center gap-4 p-4'>
            <input className='border border-gray-300 p-2 rounded-full' type="email" placeholder='enter your email'/>
            <input className='border border-gray-300 p-2 rounded-full' type="password" placeholder='enter your password'/>
            <button className='bg-blue-500 text-white p-2 rounded-full'>Log in</button>
        </form>
       </div>
    </div>
  )
}

export default login
