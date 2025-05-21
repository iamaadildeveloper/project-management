'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '../../lib/projects';
import { getEmployees } from '../../lib/employees';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
// import LoginModal from '../../login/LoginModal'; // Uncomment if you have this component

export default function AddProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        client: '',
        description: '',
        status: 'in_progress',
        projectURL: '',
        revenue: 0,
        projectStartedAt: new Date().toISOString().split('T')[0],
        dueDate: '',
        assignedEmployees: [],
    });
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [errorEmployees, setErrorEmployees] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                setToastMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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
        setShowToast(false);
        setToastMessage('');

        try {
            const projectDataToSend = {
                ...formData,
                completed: formData.status === 'completed',
                projectStartedAt: formData.projectStartedAt || null,
                dueDate: formData.dueDate || null,
            };

            await createProject(projectDataToSend);

            window.dispatchEvent(new Event('project-updated'));

            setToastMessage('Project added successfully!');
            setToastType('success');
            setShowToast(true);

            setTimeout(() => {
                router.push('/projects');
            }, 2000);

        } catch (err) {
            if (err instanceof Error && err.message === 'AUTH_REQUIRED') {
                setShowLoginModal(true);
            } else {
                const msg = err instanceof Error ? err.message : 'Failed to create project. Please try again.';
                setError(msg);
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
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
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 ml-4">Add New Project</h1>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center shadow-sm">
                        <span>{error}</span>
                        <button
                            onClick={() => setError('')}
                            className="text-red-700 hover:text-red-900 font-bold focus:outline-none"
                            aria-label="Close error"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Project Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="e.g., Develop E-commerce Platform"
                        />
                    </div>

                    {/* Client Name */}
                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="client"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="e.g., Acme Corp"
                        />
                    </div>

                    {/* Project URL */}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="https://example.com"
                        />
                    </div>

                    {/* Revenue of Project */}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="e.g., 3000.00"
                        />
                    </div>

                    {/* Project Started Date & Due Date (side-by-side on larger screens) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="projectStartedAt" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Started Date
                            </label>
                            <input
                                type="date"
                                id="projectStartedAt"
                                name="projectStartedAt"
                                value={formData.projectStartedAt}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            />
                        </div>
                    </div>

                    {/* Description */}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="Provide a detailed description of the project..."
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Assign Employees */}
                    <div>
                        <label htmlFor="assignedEmployees" className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Employees
                        </label>
                        {loadingEmployees ? (
                            <p className="text-gray-500 text-sm">Loading employees...</p>
                        ) : employees.length === 0 ? (
                            <p className="text-red-600 text-sm">No employees found. Please add employees first.</p>
                        ) : errorEmployees ? (
                            <p className="text-red-600 text-sm">{errorEmployees}</p>
                        ) : (
                            <select
                                id="assignedEmployees"
                                name="assignedEmployees"
                                multiple
                                value={formData.assignedEmployees}
                                onChange={handleEmployeeChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 h-32" // Increased height for multiple select
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

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => router.push('/projects')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-md ${
                                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

            {/* LoginModal is commented out; uncomment if you have and use it */}
            {/* <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            /> */}

            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl text-white z-50 transition-opacity duration-300 ${
                    toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
                } opacity-95`}>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">{toastMessage}</span>
                        <button onClick={() => setShowToast(false)} className="ml-4 text-white font-bold text-lg leading-none">
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
