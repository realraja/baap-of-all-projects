'use client'
import React from 'react'
import { ClipLoader } from 'react-spinners'

const loading = () => {
  return (
    <div className="h-[90vh] items-center text-center flex">
      <ClipLoader className="m-auto"  size={'270px'} color={"#F43F5E"} /> 
    </div>
  )
}

export default loading