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
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  return new Date().toISOString();
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
        dueDate: data.dueDate || undefined,
        userId: data.userId || '',
        createdAt: convertFirestoreTimestamp(data.createdAt),
        updatedAt: data.updatedAt ? convertFirestoreTimestamp(data.updatedAt) : undefined
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
      id: newProjectRef.id,
      userId: auth.currentUser.uid,
      completed: projectData.status === 'completed',
      createdAt: serverTimestamp()
    };

    await setDoc(newProjectRef, newProject);
    return newProject;
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
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      completed: updates.status ? updates.status === 'completed' : undefined
    });
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