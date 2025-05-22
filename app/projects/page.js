'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getProjects,
    updateProject,
    deleteProject as deleteProjectStorage
} from '../lib/projects';
import {
    getEmployees
} from '../lib/employees';

import {
    CheckCircleIcon,
    TrashIcon,
    PencilSquareIcon,
    ArrowLeftIcon,
    XMarkIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    PlusIcon // Added for "Add New Project" button
} from '@heroicons/react/24/outline';

function ProjectCard({
    project,
    onDelete,
    onComplete,
    isProcessing,
    onEdit,
    isEditing,
    onSaveEdit,
    onCancelEdit,
    editFormData,
    onEditInputChange,
    employeeName,
    // New props for employee selection in edit mode
    allEmployees // Pass the full list of employees
}) {
    return (
        <div className={`relative bg-white rounded-xl shadow-md p-6 border-t-4 ${
            project.completed ? 'border-green-500' : 'border-indigo-500'
        } hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1`}>
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
                {!isEditing && (
                    <>
                        {onComplete && !project.completed && (
                            <button
                                onClick={() => onComplete(project.id)}
                                disabled={isProcessing}
                                className={`p-2 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                    isProcessing
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                                }`}
                                title="Mark as completed"
                            >
                                <CheckCircleIcon className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(project.id)}
                            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Edit project"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onDelete(project.id)}
                            disabled={isProcessing}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                isProcessing
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                            }`}
                            title="Delete project"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </>
                )}
                {isEditing && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onSaveEdit(project.id, editFormData)}
                            disabled={isProcessing}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                isProcessing
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                            }`}
                            title="Save changes"
                        >
                            <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onCancelEdit}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            title="Cancel edit"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Project Details (Display Mode) */}
            {!isEditing && (
                <div className='mt-8'> {/* Adjusted margin-top to account for buttons */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Client:</span> {project.client}</p>
                    {project.projectURL && (
                        <p className="text-gray-700 text-sm mb-1">
                            <span className="font-medium">URL:</span> <a href={project.projectURL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{project.projectURL}</a>
                        </p>
                    )}

                    {employeeName && employeeName !== 'N/A' && (
                        <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Employee:</span> {employeeName}</p>
                    )}

                    {project.projectStartedAt && (
                        <p className="text-gray-700 text-sm mb-1">
                            <span className="font-medium">Started:</span> {new Date(project.projectStartedAt).toLocaleDateString()}
                        </p>
                    )}
                    {project.dueDate && (
                        <p className="text-gray-700 text-sm mb-1">
                            <span className="font-medium">Due:</span> {new Date(project.dueDate).toLocaleDateString()}
                        </p>
                    )}
                    {/* FIX: Ensure project.revenue is a number before calling toFixed */}
                    {project.revenue !== undefined && project.revenue !== null && Number(project.revenue) > 0 && (
                        <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Revenue:</span> ${Number(project.revenue).toFixed(2)}</p>
                    )}

                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">{project.description}</p>
                </div>
            )}

            {/* Project Details (Edit Mode) */}
            {isEditing && (
                <div className='mt-8 flex flex-col space-y-4'>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            name="completed"
                            checked={editFormData.completed || false}
                            onChange={(e) => onEditInputChange({ target: { name: 'completed', value: e.target.checked } })}
                            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        Completed
                    </label>
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                        <input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={editFormData.title || ''}
                            onChange={onEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-client" className="block text-sm font-medium text-gray-700 mb-1">Client:</label>
                        <input
                            type="text"
                            id="edit-client"
                            name="client"
                            value={editFormData.client || ''}
                            onChange={onEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 mb-1">URL:</label>
                        <input
                            type="text"
                            id="edit-url"
                            name="projectURL"
                            value={editFormData.projectURL || ''}
                            onChange={onEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                        <input
                            type="date"
                            id="edit-start-date"
                            name="projectStartedAt"
                            value={editFormData.projectStartedAt ? new Date(editFormData.projectStartedAt).toISOString().split('T')[0] : ''}
                            onChange={onEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-due-date" className="block text-sm font-medium text-gray-700 mb-1">Due Date:</label>
                        <input
                            type="date"
                            id="edit-due-date"
                            name="dueDate"
                            value={editFormData.dueDate ? new Date(editFormData.dueDate).toISOString().split('T')[0] : ''}
                            onChange={onEditInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                        <textarea
                            id="edit-description"
                            name="description"
                            value={editFormData.description || ''}
                            onChange={onEditInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* New: Employee Assignment in Edit Mode */}
                    <div>
                        <label htmlFor="edit-assignedEmployees" className="block text-sm font-medium text-gray-700 mb-1">
                            Assigned Employees
                        </label>
                        {allEmployees && allEmployees.length > 0 ? (
                            <select
                                id="edit-assignedEmployees"
                                name="assignedEmployees"
                                multiple
                                value={editFormData.assignedEmployees || []}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                    onEditInputChange({ target: { name: 'assignedEmployees', value: selectedOptions } });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {allEmployees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-gray-500 text-sm">No employees available to assign.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Status Badge */}
            <div className="mt-4 flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                    project.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-indigo-100 text-indigo-800'
                }`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [completingId, setCompletingId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [employeeMap, setEmployeeMap] = useState({});
    const [allEmployees, setAllEmployees] = useState([]); // New state to hold all employees

    const loadProjects = async () => {
        try {
            setLoading(true);
            const loadedProjects = await getProjects();
            const loadedEmployees = await getEmployees();

            console.log('--- Debugging ProjectsPage Data Load ---');
            console.log('1. Raw Loaded Projects:', loadedProjects);
            console.log('2. Raw Loaded Employees:', loadedEmployees);

            const empMap = loadedEmployees.reduce((acc, emp) => {
                acc[emp.id] = emp.name;
                return acc;
            }, {});
            setEmployeeMap(empMap);
            setAllEmployees(loadedEmployees); // Set the allEmployees state
            console.log('3. Employee Map (ID to Name):', empMap);

            const projectsWithEmployeeNames = loadedProjects.map(project => {
                let employeeDisplayName = 'N/A';

                console.log(`Project ID: ${project.id}, assignedEmployees:`, project.assignedEmployees);

                if (project.assignedEmployees && Array.isArray(project.assignedEmployees) && project.assignedEmployees.length > 0) {
                    const assignedNames = project.assignedEmployees
                        .map(empId => {
                            const name = empMap[empId];
                            console.log(`   - Employee ID: ${empId}, Mapped Name: ${name}`);
                            return name;
                        })
                        .filter(name => name);

                    if (assignedNames.length > 0) {
                        employeeDisplayName = assignedNames[0];
                        if (assignedNames.length > 1) {
                            employeeDisplayName += ` (+${assignedNames.length - 1} more)`;
                        }
                    }
                }

                console.log(`Project ID: ${project.id}, projectStartedAt:`, project.projectStartedAt, 'Type:', typeof project.projectStartedAt);
                if (project.projectStartedAt && typeof project.projectStartedAt === 'string') {
                    const date = new Date(project.projectStartedAt);
                    console.log(`   - Parsed projectStartedAt Date:`, date, 'Valid:', !isNaN(date.getTime()));
                }

                return {
                    ...project,
                    employeeName: employeeDisplayName
                };
            });

            console.log('4. Projects with Employee Names (Final):', projectsWithEmployeeNames);
            setProjects(Array.isArray(projectsWithEmployeeNames) ? projectsWithEmployeeNames : []);
        } catch (err) {
            console.error('Failed to load projects or employees:', err);
            setError('Failed to load projects or employees. Please try again.');
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();

        const handleProjectUpdate = () => loadProjects();
        window.addEventListener('project-updated', handleProjectUpdate);

        return () => {
            window.removeEventListener('project-updated', handleProjectUpdate);
        };
    }, []);

    const handleDelete = async (id) => {
        // Using a custom modal/confirmation instead of window.confirm for better UI control
        // For this example, I'll keep window.confirm, but in a real app, replace it.
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        setDeletingId(id);
        try {
            await deleteProjectStorage(id);
            const updatedProjects = projects.filter(p => p.id !== id);
            setProjects(updatedProjects);
            window.dispatchEvent(new Event('project-updated'));
        } catch (err) {
            console.error('Deletion failed:', err);
            setError('Failed to delete project. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleComplete = async (id) => {
        if (!window.confirm('Mark this project as completed?')) return;
        setCompletingId(id);
        try {
            await updateProject(id, {
                status: 'completed',
                completed: true
            });
            const updatedProjects = projects.map(p =>
                p.id === id ? { ...p, completed: true, status: 'completed' } : p
            );
            setProjects(updatedProjects);
            window.dispatchEvent(new Event('project-updated'));
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update project. Please try again.');
        } finally {
            setCompletingId(null);
        }
    };

    const handleEdit = (id) => {
        const projectToEdit = projects.find(p => p.id === id);
        if (projectToEdit) {
            setEditingId(id);
            setEditFormData({
                title: projectToEdit.title,
                client: projectToEdit.client,
                projectURL: projectToEdit.projectURL,
                dueDate: projectToEdit.dueDate,
                description: projectToEdit.description,
                projectStartedAt: projectToEdit.projectStartedAt,
                completed: projectToEdit.completed,
                assignedEmployees: projectToEdit.assignedEmployees || [], // Initialize assignedEmployees
            });
        }
    };

    const handleSaveEdit = async (id, formData) => {
        setIsSaving(true);
        try {
            const updateData = { ...formData };

            if (updateData.projectStartedAt) {
                updateData.projectStartedAt = new Date(updateData.projectStartedAt).toISOString();
            } else {
                updateData.projectStartedAt = null;
            }

            if (updateData.dueDate) {
                updateData.dueDate = new Date(updateData.dueDate).toISOString();
            } else {
                updateData.dueDate = null;
            }

            updateData.completed = formData.completed;
            updateData.assignedEmployees = formData.assignedEmployees; // Ensure assignedEmployees is saved

            await updateProject(id, updateData);
            // Reload projects to ensure employee names are correctly updated if assignments changed
            await loadProjects();
            setEditingId(null);
            window.dispatchEvent(new Event('project-updated'));
        } catch (err) {
            console.error('Failed to update project:', err);
            setError('Failed to update project. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({});
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // Use employeeMap here for filtering by employee name
        (project.assignedEmployees && project.assignedEmployees.some(empId => employeeMap[empId] && employeeMap[empId].toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const activeProjects = filteredProjects.filter(p => !p.completed);
    const completedProjects = filteredProjects.filter(p => p.completed);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center justify-center">
                <div className="flex items-center text-gray-700 text-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Projects...
                </div>
            </div>
        );
    }

    return (
        // Changed padding to px-0 on mobile, and px-4 on larger screens for less space
        <div className="min-h-screen bg-gray-100 px-0 py-4 md:px-4 md:py-8 font-inter">
            {/* The content inside this div will now stretch more */}
            <div>
                {/* Header Section */}
                {/* Reduced horizontal padding to px-2 on mobile for header elements */}
                <div className="flex items-center mb-8 px-2">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Go back"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 ml-4">Project Dashboard</h1>
                </div>

                {/* Error Banner */}
                {/* Reduced horizontal padding to px-2 on mobile for error banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center shadow-sm mx-2">
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

                {/* Main Content Area */}
                {/* This div now has no horizontal padding from the layout,
                    its internal elements will control their own spacing. */}
                <div className="bg-white rounded-xl shadow-lg mb-8 mx-2 md:mx-0"> {/* Added mx-2 for mobile, mx-0 for desktop */}
                    {/* Search Bar */}
                    <div className="p-6 relative mb-6"> {/* p-6 provides internal padding */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search projects by title, client, description, or employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                        />
                    </div>

                    {/* Active Projects Section */}
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"> {/* Changed to flex-col on mobile, flex-row on sm+ */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                            Active Projects{' '}
                            {/* Using employeeMap here to display total number of employees */}
                            <span className="text-gray-500 text-base font-normal">
                                ({Object.keys(employeeMap).length} Employees Registered)
                            </span>
                        </h2>
                        <Link
                            href="/projects/add"
                            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-md w-full sm:w-auto text-sm sm:text-base" // Adjusted px/py for mobile, added text-sm/text-base
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add New Project
                        </Link>
                    </div>

                    {activeProjects.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 p-6 pt-0"> {/* p-6 provides internal padding, pt-0 removes top */}
                            {activeProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onDelete={handleDelete}
                                    onComplete={handleComplete}
                                    isProcessing={deletingId === project.id || completingId === project.id || (isSaving && editingId === project.id)}
                                    onEdit={handleEdit}
                                    isEditing={editingId === project.id}
                                    onSaveEdit={handleSaveEdit}
                                    onCancelEdit={handleCancelEdit}
                                    editFormData={editFormData}
                                    onEditInputChange={handleEditInputChange}
                                    employeeName={project.employeeName}
                                    allEmployees={allEmployees} // Pass allEmployees to ProjectCard
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 mx-6 mb-6"> {/* mx-6 mb-6 for internal spacing */}
                            <p className="text-gray-500 text-lg">No active projects found. Start by adding a new one!</p>
                        </div>
                    )}
                </div>

                {/* Completed Projects Section */}
                {completedProjects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mx-2 md:mx-0"> {/* Added mx-2 for mobile, mx-0 for desktop */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Completed Projects</h2>
                        <div className="grid gap-6 md:grid-cols-2"> {/* Changed grid layout here */}
                            {completedProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onDelete={handleDelete}
                                    isProcessing={deletingId === project.id || (isSaving && editingId === project.id)}
                                    onEdit={handleEdit}
                                    isEditing={editingId === project.id}
                                    onSaveEdit={handleSaveEdit}
                                    onCancelEdit={handleCancelEdit}
                                    editFormData={editFormData}
                                    onEditInputChange={handleEditInputChange}
                                    employeeName={project.employeeName}
                                    allEmployees={allEmployees} // Pass allEmployees to ProjectCard
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
