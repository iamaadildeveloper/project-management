// lib/projects.js
import { db, auth } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

// Helper to safely convert Firestore Timestamp to ISO string
const convertFirestoreTimestamp = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return null; // Return null if timestamp is not valid or not a Firestore Timestamp
};

// Get all projects for the current user
export const getProjects = async () => {
  try {
    if (!auth.currentUser) return [];

    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        client: data.client || '',
        description: data.description || '',
        status: data.status || 'not_started',
        completed: data.status === 'completed',
        projectURL: data.projectURL || '',
        revenue: data.revenue || 0,
        // Convert Firestore Timestamp for dueDate and projectStartedAt
        dueDate: convertFirestoreTimestamp(data.dueDate),
        projectStartedAt: convertFirestoreTimestamp(data.projectStartedAt), // Ensure conversion from Firestore Timestamp
        assignedEmployees: data.assignedEmployees || [], // Ensure this is retrieved as an array
        userId: data.userId || '',
        createdAt: convertFirestoreTimestamp(data.createdAt),
        updatedAt: data.updatedAt ? convertFirestoreTimestamp(data.updatedAt) : null
      };
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    throw new Error('Failed to load projects. Please try again later.');
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const newProjectRef = doc(collection(db, PROJECTS_COLLECTION));
    const newProject = {
      ...projectData,
      userId: auth.currentUser.uid,
      completed: projectData.status === 'completed',
      createdAt: serverTimestamp(),
      // Ensure date fields are converted to Date objects for Firestore if they are strings
      projectStartedAt: projectData.projectStartedAt ? new Date(projectData.projectStartedAt) : null,
      dueDate: projectData.dueDate ? new Date(projectData.dueDate) : null,
      // assignedEmployees is already an array from projectData, no special handling needed here
    };

    await setDoc(newProjectRef, newProject);
    return { id: newProjectRef.id, ...newProject, createdAt: new Date().toISOString() }; // Return with ID and a client-side timestamp for immediate use
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project. Please try again.');
  }
};

// Update an existing project
export const updateProject = async (id, updates) => {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    const updatePayload = { ...updates, updatedAt: serverTimestamp() };

    // Ensure date fields are converted to Date objects or removed if empty for Firestore
    if (updatePayload.projectStartedAt === '') {
        updatePayload.projectStartedAt = null; // Set to null for empty date
    } else if (typeof updatePayload.projectStartedAt === 'string') {
        updatePayload.projectStartedAt = new Date(updatePayload.projectStartedAt);
    }

    if (updatePayload.dueDate === '') {
        updatePayload.dueDate = null; // Set to null for empty date
    } else if (typeof updatePayload.dueDate === 'string') {
        updatePayload.dueDate = new Date(updatePayload.dueDate);
    }

    await updateDoc(projectRef, updatePayload);
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project. Please try again.');
  }
};

// Delete a project
export const deleteProject = async (id) => {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project. Please try again.');
  }
};

// Alias for deleteProject with consistent naming
export const deleteProjectStorage = deleteProject;
