import { auth } from './firebase';
import { collection, doc, setDoc, getFirestore } from 'firebase/firestore';

export const migrateLocalData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const localData = localStorage.getItem('freelance_projects');
    if (!localData) return;

    const projects = JSON.parse(localData);
    const db = getFirestore();

    const migrationPromises = projects.map(async (project) => {
      await setDoc(doc(collection(db, 'projects')), {
        ...project,
        userId: user.uid,
        id: doc(collection(db, 'projects')).id,
        createdAt: project.createdAt || new Date().toISOString()
      });
    });

    await Promise.all(migrationPromises);
    localStorage.removeItem('freelance_projects');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};