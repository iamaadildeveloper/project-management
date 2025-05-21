'use client';
import { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../lib/employees'; // Adjust the path if necessary
import Link from 'next/link';
import {
    PencilSquareIcon,
    TrashIcon,
    ArrowLeftIcon, // For the back button
    PlusIcon // For the add new employee button
} from '@heroicons/react/24/outline';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null); // State to track which employee is being deleted

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                setLoading(true); // Set loading to true when starting fetch
                const data = await getEmployees();
                setEmployees(data);
            } catch (err) {
                console.error('Failed to load employees:', err);
                setError('Failed to load employees. Please try again.');
            } finally {
                setLoading(false); // Set loading to false after fetch completes
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
        // Using a custom modal/confirmation instead of window.confirm for better UI control
        // For this example, I'll keep window.confirm, but in a real app, replace it.
        if (!window.confirm('Are you sure you want to delete this employee?')) return;

        setDeletingId(id); // Set the ID of the employee being deleted
        try {
            await deleteEmployee(id);
            const updatedEmployees = employees.filter(employee => employee.id !== id);
            setEmployees(updatedEmployees);
            window.dispatchEvent(new Event('employees-updated')); // Notify other components
        } catch (err) {
            console.error('Failed to delete employee:', err);
            setError('Failed to delete employee. Please try again.');
        } finally {
            setDeletingId(null); // Reset deleting ID
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center justify-center">
                <div className="flex items-center text-gray-700 text-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Employees...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center mb-8">
                    <Link href="/" className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Go back to dashboard">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 ml-4">Employee Directory</h1>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center shadow-sm">
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-700 hover:text-red-900 font-bold focus:outline-none"
                            aria-label="Close error"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">All Employees</h2>
                        <Link
                            href="/employees/add"
                            className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-md"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add New Employee
                        </Link>
                    </div>

                    {employees.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No employees found. Start by adding a new one!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* FIX: Removed whitespace between <table> and <thead> */}
                            <table className="min-w-full leading-normal table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(employee => (
                                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">
                                                {employee.name}
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">
                                                {employee.role || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">
                                                {employee.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-gray-900">
                                                {employee.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm flex items-center space-x-2">
                                                <Link href={`/employees/edit/${employee.id}`} className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200" title="Edit Employee">
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteEmployee(employee.id)}
                                                    disabled={deletingId === employee.id}
                                                    className={`text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors duration-200 ${
                                                        deletingId === employee.id ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    title="Delete Employee"
                                                >
                                                    {deletingId === employee.id ? (
                                                        <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <TrashIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
