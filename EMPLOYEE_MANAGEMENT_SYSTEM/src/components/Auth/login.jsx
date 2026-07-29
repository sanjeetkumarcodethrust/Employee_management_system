import React from 'react'

const login = () => {
  return (
    <div className='flex item-center justify-center '>
       <div className= 'border-2 border-red-600'>
        <form >
            <input type="email" placeholder='enter your email'/>
            <input type="password" placeholder='enter your password'/>
        </form>
       </div>
    </div>
  )
}

export default login
