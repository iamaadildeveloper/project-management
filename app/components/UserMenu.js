'use client';

import { useAuth } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function UserMenu() {
  const { user, loading, googleLogin, logout } = useAuth();

  if (loading) return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />;

  return (
    <Menu as="div" className="relative">
      {user ? (
        <>
          <Menu.Button className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt="User" 
                  className="h-8 w-8 rounded-full" 
                />
              ) : (
                <UserIcon className="h-5 w-5 text-indigo-600" />
              )}
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {user.displayName || user.email}
                  </div>
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      ) : (
        <button
          onClick={googleLogin}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Login
        </button>
      )}
    </Menu>
  );
}