'use client';

import { useEffect, useState } from 'react';
import { getProjects } from '../lib/projects';
import { getEmployees } from '../lib/employees'; 
import {
    CheckCircleIcon,
    ClockIcon,
    BanknotesIcon,
    FolderIcon,
    UsersIcon // Import UsersIcon for the employees card
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        total: 0,
        revenue: 0,
        totalEmployees: 0, // New state for total employees
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(true); // New loading state for employees
    const [errorEmployees, setErrorEmployees] = useState(null); // New error state for employees

    const updateStats = async () => {
        try {
            setLoading(true);
            const projects = await getProjects();
            const active = projects.filter(p => !p.completed).length;
            const completed = projects.filter(p => p.completed).length;
            const revenue = projects.reduce((total, p) => total + (p.revenue || 0), 0);

            setStats(prevStats => ({
                ...prevStats,
                active,
                completed,
                total: active + completed,
                revenue,
            }));
        } catch (err) {
            setError('Failed to load projects.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Async function to load employees and update the total employee count
    const loadEmployeesCount = async () => {
        try {
            setLoadingEmployees(true);
            const employees = await getEmployees();
            setStats(prevStats => ({
                ...prevStats,
                totalEmployees: employees.length,
            }));
        } catch (err) {
            setErrorEmployees('Failed to load employees.');
            console.error(err);
        } finally {
            setLoadingEmployees(false);
        }
    };

    useEffect(() => {
        updateStats();
        loadEmployeesCount();
        // If you want realtime updates, consider adding Firestore onSnapshot listeners here
    }, []);

    if (loading || loadingEmployees) return <p>Loading dashboard data...</p>;
    if (error || errorEmployees) return <p className="text-red-600">{error || errorEmployees}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Freelance Management</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* Adjusted grid columns */}
                {/* Total Projects Card */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <FolderIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                    </div>
                </div>

                {/* Active Projects Card */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ClockIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Active Projects</h3>
                            <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% of total` : 'No projects'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completed Projects Card */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Completed Projects</h3>
                            <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% of total` : 'No projects'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Revenue Card */}
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="flex items-center space-x-4">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                            <p className="text-2xl font-bold text-gray-800">
                                ${stats.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.completed > 0 ? `Avg: $${Math.round(stats.revenue / stats.completed)}/project` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Employees Card */}
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <UsersIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}