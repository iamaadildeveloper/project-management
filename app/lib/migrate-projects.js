import { auth, db } from './firebase';
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';

const migrateProjects = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const projectsSnapshot = await getDocs(collection(db, 'projects'));

    for (const projectDoc of projectsSnapshot.docs) {
      const projectData = projectDoc.data();

      const userProjectRef = doc(db, 'users', user.uid, 'projects', projectDoc.id);

      await setDoc(userProjectRef, {
        ...projectData,
        createdAt: projectData.createdAt ? projectData.createdAt : Timestamp.now(),
      });

      console.log(`Migrated project ${projectDoc.id} for user ${user.uid}`);
    }

    console.log('Project migration completed');
  } catch (error) {
    console.error('Error migrating projects:', error);
  }
};

export default migrateProjects;