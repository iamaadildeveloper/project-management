// app/employees/employeeList.js
'use client';
import { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../lib/employees'; // Adjust the path if necessary
import Link from 'next/link';
import {
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline'; // Ensure you have @heroicons/react installed

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (err) {
                console.error('Failed to load employees:', err);
                setError('Failed to load employees.');
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();

        const handleEmployeeUpdate = () => loadEmployees();
        window.addEventListener('employees-updated', handleEmployeeUpdate);

        return () => {
            window.removeEventListener('employees-updated', handleEmployeeUpdate);
        };
    }, []);

const handleDeleteEmployee = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                // Optionally, refresh the employee list after deletion
                const updatedEmployees = employees.filter(employee => employee.id !== id);
                setEmployees(updatedEmployees);
                window.dispatchEvent(new Event('employees-updated')); // Notify other components
            } catch (err) {
                console.error('Failed to delete employee:', err);
                // Display an error message to the user
            }
        }
    };

    if (loading) {
        return <div>Loading employees...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error loading employees: {error}</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full leading-normal">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Employee Role
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                        
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {employee.name}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {employee.role}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {employee.email}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {employee.phone}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex">
                                <Link href={`/employees/edit/${employee.id}`} className="text-indigo-600 hover:text-indigo-800 mr-2">
                                    <PencilSquareIcon className="h-4 w-4" />
                                </Link>
                                <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-800">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}