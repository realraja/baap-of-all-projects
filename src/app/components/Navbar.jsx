import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-between px-5 py-3 text-2xl bg-gray-600'>
      <div><h1 className='text-rose-500'>Test.App</h1></div>

      <div className='space-x-2 font-sans'>
        <Link className='hover:bg-gray-900 p-[10px]' href="/">Home</Link>
        <Link className='hover:bg-gray-900 p-[10px]' href="/register">Sign In</Link>
        <Link className='hover:bg-gray-900 p-[10px]' href="/login">Log In</Link>
      </div>
    </nav>
  )
}

export default Navbar
