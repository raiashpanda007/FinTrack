'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

const tabs = ['Transaction', 'Category', 'Budget'];

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Extract the current tab from the URL (/dashboard/{tab})
  const currentTab = pathname.split('/')[2] || 'Transaction'; // Default to 'Transaction'

  // Handle clicking on a tab
  const handleTabClick = (tabName: string) => {
    router.push(`/dashboard/${tabName}`);
  };

  return (
    <div className="fixed flex z-50 w-1/6 bg-black">
      {/* Toggle Button (Always Visible) */}
      <Button
        variant="ghost"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-2 z-20"
      >
        <FiMenu size={24} className="cursor-pointer text-white" />
      </Button>

      {/* Sidebar */}
      <div
        className={`bg-black text-white h-screen p-4 transition-all duration-300 ${
          visible ? 'w-full' : 'hidden'
        } overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="mb-6 w-full mt-8">
          {visible && <h1 className="text-2xl  font-bold">FinTrack</h1>}
        </div>

        {/* Sidebar Tabs */}
        <div className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`cursor-pointer p-2 rounded transition
                ${currentTab === tab ? 'bg-red-500' : 'hover:bg-red-600'}
                ${visible ? 'pl-4' : 'text-center'}
              `}
            >
              {currentTab === tab ? (
                <h1 className="text-xl">{tab}</h1>
              ) : (
                <p>{tab}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
