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
    CheckCircleIcon,
    TrashIcon,
    PencilSquareIcon,
    ArrowLeftIcon,
    XMarkIcon,
    CheckIcon,
    MagnifyingGlassIcon // Import for the search icon
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

}) {
    return (
        <div className={`border rounded-lg p-4 relative transition-all ${
            project.completed ? 'bg-green-50' : 'bg-indigo-50'
        }`}>
            <div className="absolute top-3 right-3 flex space-x-2">
                {!isEditing && (
                    <>
                        {onComplete && !project.completed && (
                            <button
                                onClick={() => onComplete(project.id)}
                                disabled={isProcessing}
                                className={`p-1 rounded-full flex ${
                                    isProcessing
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-green-600 hover:bg-green-100'
                                }`}
                                title="Mark as completed"
                            >
                                <CheckCircleIcon className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(project.id)}
                            className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100"
                            title="Edit project"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onDelete(project.id)}
                            disabled={isProcessing}
                            className={`p-1 rounded-full ${
                                isProcessing
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-100'
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
                            className={`p-1 rounded-full ${
                                isProcessing
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-green-600 hover:bg-green-100'
                            }`}
                            title="Save changes"
                        >
                            <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onCancelEdit}
                            className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                            title="Cancel edit"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {!isEditing && (
                <div className='mt-10'>
                    <h3 className="text-lg font-medium text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mt-1">Client: {project.client}</p>
                    <p className="text-gray-600">URL: {project.projectURL}</p>
                    {project.projectStartedAt && (
                        <p className="text-gray-600">
                            Started: {new Date(project.projectStartedAt).toLocaleDateString()}
                        </p>
                    )}
                    {project.dueDate && (
                        <p className="text-gray-600">
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                        </p>
                    )}

                    <p className="text-gray-600 mt-2">{project.description}</p>
                </div>
            )}

            {isEditing && (
                 
                <div className='mt-10 flex flex-col space-y-3'>
                    <label className="text-sm font-medium text-gray-700">Title:</label>
                     <label className="text-sm font-medium text-gray-700 flex items-center">
            <input
                type="checkbox"
                name="completed"
                checked={editFormData.completed || false} // Ensure it defaults to false if undefined
                onChange={(e) => onEditInputChange({ target: { name: 'completed', value: e.target.checked } })}
                className="mr-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            Completed
        </label>
                    <input
                        type="text"
                        name="title"
                        value={editFormData.title || ''}
                        onChange={onEditInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <label className="text-sm font-medium text-gray-700">Client:</label>
                    <input
                        type="text"
                        name="client"
                        value={editFormData.client || ''}
                        onChange={onEditInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <label className="text-sm font-medium text-gray-700">URL:</label>
                    <input
                        type="text"
                        name="projectURL"
                        value={editFormData.projectURL || ''}
                        onChange={onEditInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <label className="text-sm font-medium text-gray-700">Start Date:</label>
                    <input
                        type="date"
                        name="projectStartedAt"
                        value={editFormData.projectStartedAt ? new Date(editFormData.projectStartedAt).toISOString().split('T')[0] : ''}
                        onChange={onEditInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <label className="text-sm font-medium text-gray-700">Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={editFormData.dueDate ? new Date(editFormData.dueDate).toISOString().split('T')[0] : ''}
                        onChange={onEditInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <label className="text-sm font-medium text-gray-700">Description:</label>
                    <textarea
                        name="description"
                        value={editFormData.description || ''}
                        onChange={onEditInputChange}
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            )}

            <div className="mt-4 flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    project.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-indigo-100 text-indigo-800'
                }`}>
                    {project.status.replace('_', ' ')}
                </span>
                {/* Removed the "View Details" link */}
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
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term

    const loadProjects = async () => {
        try {
            setLoading(true);
            const loadedProjects = await getProjects();
            setProjects(Array.isArray(loadedProjects) ? loadedProjects : []);
        } catch (err) {
            console.error('Failed to load projects:', err);
            setError('Failed to load projects. Please try again.');
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();

        // Add event listener for project updates
        const handleProjectUpdate = () => loadProjects();
        window.addEventListener('project-updated', handleProjectUpdate);

        return () => {
            window.removeEventListener('project-updated', handleProjectUpdate);
        };
    }, []);

    const handleDelete = async (id) => {
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
                completed: projectToEdit.completed
            });
        }
    };

const handleSaveEdit = async (id, formData) => {
        setIsSaving(true);
        try {
            const updateData = { ...formData };

            // Ensure projectStartedAt is a valid string or explicitly remove if empty
            if (updateData.projectStartedAt) {
                updateData.projectStartedAt = new Date(updateData.projectStartedAt).toISOString();
            } else {
                delete updateData.projectStartedAt; // Or set to null if your Firebase schema allows it
            }

            // Similarly, ensure dueDate is handled correctly
            if (updateData.dueDate) {
                updateData.dueDate = new Date(updateData.dueDate).toISOString();
            } else {
                delete updateData.dueDate; // Or set to null
            }

            await updateProject(id, updateData);
            const updatedProjects = projects.map(p =>
                p.id === id ? { ...p, ...formData } : p
            );
            setProjects(updatedProjects);
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
        const { name, value } = e.target;
        setEditFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeProjects = filteredProjects.filter(p => !p.completed);
    const completedProjects = filteredProjects.filter(p => p.completed);

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500">Loading Please Wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="float-right font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                {/* Search Input */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search projects by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Active Projects</h2>
                    <Link
                        href="/projects/add"
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        Add New Project
                    </Link>
                </div>

                {activeProjects.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No active projects found</p>
                    </div>
                )}
            </div>

            {completedProjects.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Completed Projects</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}