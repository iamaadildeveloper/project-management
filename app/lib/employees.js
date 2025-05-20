// lib/employees.js
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const employeesCollectionRef = collection(db, 'employees');

export async function createEmployee(data) {
    try {
        const docRef = await addDoc(employeesCollectionRef, data);
        console.log('Employee added with ID: ', docRef.id);
        return { id: docRef.id, ...data }; // Return the new employee data with its ID
    } catch (error) {
        console.error('Error adding employee: ', error);
        throw new Error('Failed to add employee to Firestore.');
    }
}

export async function getEmployees() {
    try {
        const querySnapshot = await getDocs(employeesCollectionRef);
        const employees = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return employees;
    } catch (error) {
        console.error('Error fetching employees: ', error);
        throw new Error('Failed to fetch employees from Firestore.');
    }
}

// You might need functions to update and delete employees as well
// For example:
export async function updateEmployee(id, data) {
    const employeeDocRef = doc(db, 'employees', id);
    try {
        await updateDoc(employeeDocRef, data);
        console.log('Employee updated with ID: ', id);
    } catch (error) {
        console.error('Error updating employee: ', error);
        throw new Error('Failed to update employee in Firestore.');
    }
}

export async function deleteEmployee(id) {
    const employeeDocRef = doc(db, 'employees', id);
    try {
        await deleteDoc(employeeDocRef);
        console.log('Employee deleted with ID: ', id);
    } catch (error) {
        console.error('Error deleting employee: ', error);
        throw new Error('Failed to delete employee from Firestore.');
    }
}