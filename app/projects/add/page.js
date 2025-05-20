'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '../../lib/projects';
import { getEmployees } from '../../lib/employees'; // Import the function to fetch employees
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoginModal from '../../login/LoginModal';

export default function AddProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        description: '',
        status: 'in_progress',
        projectURL: '',
        revenue: 0,
        projectStartedAt: new Date().toISOString(),
        assignedEmployees: [], // To store the IDs of assigned employees
    });
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [errorEmployees, setErrorEmployees] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeList = await getEmployees();
                setEmployees(employeeList);
            } catch (err) {
                console.error('Failed to load employees:', err);
                setErrorEmployees('Failed to load employees. Please try again.');
            } finally {
                setLoadingEmployees(false);
            }
        };

        fetchEmployees();

        // Add event listener for employee updates
        const handleEmployeeUpdate = () => fetchEmployees();
        window.addEventListener('employees-updated', handleEmployeeUpdate);

        return () => {
            window.removeEventListener('employees-updated', handleEmployeeUpdate);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const updatedProjects = await createProject({
                ...formData,
                completed: formData.status === 'completed',
                assignedEmployees: formData.assignedEmployees, // Send assigned employees data
            });

            window.dispatchEvent(new CustomEvent('projects-updated', {
                detail: { projects: updatedProjects }
            }));

            router.push('/projects');
        } catch (err) {
            if (err instanceof Error && err.message === 'AUTH_REQUIRED') {
                setShowLoginModal(true);
            } else {
                setError(err instanceof Error ? err.message : 'Failed to create project. Please try again.');
                console.error('Project creation error:', err);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'revenue' ? Number(value) : value
        }));
    };

    const handleEmployeeChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prev => ({ ...prev, assignedEmployees: selectedOptions }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="mr-4 p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add New Project</h1>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                    <span>{error}</span>
                    <button
                        onClick={() => setError('')}
                        className="text-red-700 hover:text-red-900 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow max-w-3xl mx-auto">
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title*
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter project title"
                            />
                        </div>

                        <div>
                            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name*
                            </label>
                            <input
                                type="text"
                                id="client"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter client name"
                            />
                        </div>

                        <div>
                            <label htmlFor="projectURL" className="block text-sm font-medium text-gray-700 mb-1">
                                Project URL
                            </label>
                            <input
                                type="url"
                                id="projectURL"
                                name="projectURL"
                                value={formData.projectURL}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">
                                Revenue of Project
                            </label>
                            <input
                                type="number"
                                id="revenue"
                                name="revenue"
                                value={formData.revenue}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="3000"
                            />
                        </div>

                        <div>
                            <label htmlFor="projectStartedAt" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Started Date
                            </label>
                            <input
                                type="date"
                                id="projectStartedAt"
                                name="projectStartedAt"
                                value={formData.projectStartedAt || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter project description"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status*
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="not_started">Not Started</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
    <label htmlFor="assignedEmployees" className="block text-sm font-medium text-gray-700 mb-1">
        Assign Employees
    </label>
    {loadingEmployees ? (
        <p className="text-gray-500">Loading employees...</p>
    ) : errorEmployees ? (
        <p className="text-red-500">{errorEmployees}</p>
    ) : (
        <select
            id="assignedEmployees"
            name="assignedEmployees"
            multiple // Allow multiple selections
            value={formData.assignedEmployees}
            onChange={handleEmployeeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <option value="" disabled>Select employees</option>
            {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                    {employee.name}
                </option>
            ))}
        </select>
    )}
</div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/projects')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
}