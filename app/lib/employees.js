// lib/employees.js
import { db, auth } from './firebase'; // Ensure 'auth' is imported
import {
  collection,
  query, // Import query
  where, // Import where
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp // Import serverTimestamp
} from 'firebase/firestore';

const EMPLOYEES_COLLECTION = 'employees';

// Helper to safely convert Firestore Timestamp to ISO string
const convertFirestoreTimestamp = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return null; // Return null if timestamp is not valid
};

export async function createEmployee(employeeData) {
    try {
        if (!auth.currentUser) {
            throw new Error('User not authenticated. Cannot create employee.');
        }

        const newEmployee = {
            ...employeeData,
            userId: auth.currentUser.uid, // CRUCIAL: Associate with current user
            createdAt: serverTimestamp(), // Add creation timestamp
        };

        const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), newEmployee);
        console.log('Employee added with ID: ', docRef.id);
        return { id: docRef.id, ...newEmployee };
    } catch (error) {
        console.error('Error adding employee: ', error);
        throw new Error('Failed to add employee to Firestore.');
    }
}

export async function getEmployees() {
    try {
        if (!auth.currentUser) {
            console.warn('No authenticated user. Returning empty employee list.');
            return [];
        }

        const q = query(
            collection(db, EMPLOYEES_COLLECTION),
            where('userId', '==', auth.currentUser.uid) // Only get employees for this user
        );

        const querySnapshot = await getDocs(q);
        const employees = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name, // Ensure 'name' field is retrieved
                ...data,
                createdAt: convertFirestoreTimestamp(data.createdAt),
                updatedAt: data.updatedAt ? convertFirestoreTimestamp(data.updatedAt) : null,
            };
        });
        return employees;
    } catch (error) {
        console.error('Error fetching employees: ', error);
        throw new Error('Failed to fetch employees from Firestore.');
    }
}

export async function updateEmployee(id, updates) {
    try {
        if (!auth.currentUser) {
            throw new Error('User not authenticated. Cannot update employee.');
        }

        const employeeDocRef = doc(db, EMPLOYEES_COLLECTION, id);
        await updateDoc(employeeDocRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
        console.log('Employee updated with ID: ', id);
    } catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Failed to update employee. Please try again.');
    }
}

export async function deleteEmployee(id) {
    try {
        if (!auth.currentUser) {
            throw new Error('User not authenticated. Cannot delete employee.');
        }

        const employeeDocRef = doc(db, EMPLOYEES_COLLECTION, id);
        await deleteDoc(employeeDocRef);
        console.log('Employee deleted with ID: ', id);
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw new Error('Failed to delete employee from Firestore.');
    }
}
