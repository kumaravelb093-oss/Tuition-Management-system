import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    doc,
    getDoc
} from "firebase/firestore";

export interface Payment {
    id?: string;
    studentId: string;
    studentCode?: string;
    studentName: string;
    grade: string;
    amount: number;
    feeMonth: string; // e.g. "January" or "Admission"
    feeYear: number;
    paymentDate: string;
    receiptNumber?: string;
    remarks?: string;
    createdAt?: any;
}

const COLLECTION_NAME = "payments";

export const feeService = {
    addPayment: async (payment: Omit<Payment, "id" | "receiptNumber">) => {
        try {
            // Generate Receipt Number: TMS-YYYYMMDD-RANDOM
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const random = Math.floor(1000 + Math.random() * 9000);
            const receiptNumber = `TMS-${dateStr}-${random}`;

            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...payment,
                receiptNumber,
                createdAt: Timestamp.now(),
            });
            return { id: docRef.id, receiptNumber, ...payment };
        } catch (error) {
            console.error("Error adding payment:", error);
            throw error;
        }
    },

    getRecentPayments: async (limit = 20) => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            // Firestore limit() requires index sometimes, for now just get latest
            const querySnapshot = await getDocs(q);
            // Client side slice for simplicity in initial version or add limit(limit)
            return querySnapshot.docs.slice(0, limit).map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Payment[];
        } catch (error) {
            console.error("Error getting payments:", error);
            throw error;
        }
    },

    getPaymentsByStudent: async (studentId: string) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("studentId", "==", studentId)
            );
            const querySnapshot = await getDocs(q);
            const payments = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Payment[];
            // Sort client-side
            return payments.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB - dateA;
            });
        } catch (error) {
            console.error("Error getting student payments:", error);
            throw error;
        }
    }
};
