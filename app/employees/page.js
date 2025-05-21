// app/employees/page.js
'use client';

import EmployeeList from './employeeList';
// import Link from 'next/link';
// import { PlusIcon } from '@heroicons/react/24/outline'; // Ensure you have @heroicons/react installed

export default function EmployeesPage() {
    return (
        <div className="p-6">
            <EmployeeList />
        </div>
    );
}