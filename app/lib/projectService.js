import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // Your Firebase setup file here

export async function createProjectFirebase(projectData, uid) {
  await addDoc(collection(db, 'projects'), {
    ...projectData,
    uid, // Save user ID with the project
    completed: projectData.status === 'completed',
    createdAt: serverTimestamp(),
  });
}