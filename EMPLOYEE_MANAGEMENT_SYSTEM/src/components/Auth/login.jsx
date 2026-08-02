import React from 'react'

const login = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center '>
       <div className= 'border-2 border-red-600'>
        <form  className='flex flex-col items-center justify-center gap-4 p-4'>
            <input type="email" placeholder='enter your email'/>
            <input type="password" placeholder='enter your password'/>
            <button>Log in</button>
        </form>
       </div>
    </div>
  )
}

export default login
