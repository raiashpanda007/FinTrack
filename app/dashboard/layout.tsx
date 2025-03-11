import Sidebar from '@/Components/Dashboard/Sidebar'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex'>
        <Sidebar />
        {children}
    </div>
  )
}

export default layout