'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function SidebarItem({ 
  icon, 
  href, 
  children 
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <a 
        href={href}
        className={`sidebarItem ${isActive ? 'active' : ''}`}
      >
        <span className="sidebarIcon">
          {icon}
        </span>
        <span>{children}</span>
      </a>
    </li>
  )
}