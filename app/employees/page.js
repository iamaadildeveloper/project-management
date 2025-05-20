// app/employees/page.js
'use client';

import EmployeeList from './employeeList';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline'; // Ensure you have @heroicons/react installed

export default function EmployeesPage() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
                <Link href="/employees/add" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Employee
                </Link>
            </div>
            <EmployeeList />
        </div>
    );
}