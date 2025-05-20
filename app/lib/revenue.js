// lib/revenue.js
import { db, auth } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    query,
    where
} from 'firebase/firestore';

const REVENUE_COLLECTION = 'revenue';

export const addRevenue = async (revenueData) => {
    try {
        if (!auth.currentUser) throw new Error('User not authenticated');

        const newRevenueRef = await addDoc(collection(db, REVENUE_COLLECTION), {
            ...revenueData,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });
        return { id: newRevenueRef.id, ...revenueData };
    } catch (error) {
        console.error('Error adding revenue:', error);
        throw new Error('Failed to add revenue. Please try again.');
    }
};

export const getRevenue = async () => {
    try {
        if (!auth.currentUser) return [];

        const q = query(
            collection(db, REVENUE_COLLECTION),
            where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error fetching revenue:', error);
        throw new Error('Failed to fetch revenue. Please try again.');
    }
};