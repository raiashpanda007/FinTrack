import Sidebar from '@/Components/Dashboard/Sidebar'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex'>
        <Sidebar />
        <div className='h-full w-full'>
        {children}
        </div>
    </div>
  )
}

export default layout