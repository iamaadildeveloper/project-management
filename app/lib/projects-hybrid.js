import { db, auth } from './firebase';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

/**
 * Fetches hybrid projects:
 * - Public projects from 'projects'
 * - User-specific projects from 'users/{uid}/projects'
 * If a user-specific version exists, it overrides the public one.
 */
const getHybridProjects = async () => {
  const user = auth.currentUser;
  const uid = user?.uid;

  try {
    // Fetch public projects
    const publicProjectsSnapshot = await getDocs(collection(db, 'projects'));

    const publicProjects = {};
    publicProjectsSnapshot.forEach((doc) => {
      publicProjects[doc.id] = { ...doc.data(), id: doc.id, source: 'public' };
    });

    // If user is authenticated, fetch user-specific projects
    if (uid) {
      const userProjectsSnapshot = await getDocs(collection(db, 'users', uid, 'projects'));

      userProjectsSnapshot.forEach((doc) => {
        publicProjects[doc.id] = {
          ...doc.data(),
          id: doc.id,
          source: 'user',
        }; // Override or add user-specific version
      });
    }

    return Object.values(publicProjects); // Return merged list
  } catch (error) {
    console.error('Error fetching hybrid projects:', error);
    return [];
  }
};

export default getHybridProjects;