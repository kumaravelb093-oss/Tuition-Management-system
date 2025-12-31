import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";

export interface Student {
    id?: string;
    studentId?: string; // Auto-generated human readable ID if needed (e.g. STU001)
    fullName: string;
    grade: string;
    section?: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    address: string;
    phone: string;
    email?: string;
    parentName: string;
    joiningDate: string;
    status: "Active" | "Inactive";
    createdAt?: any;
}

const COLLECTION_NAME = "students";

export const studentService = {
    addStudent: async (student: Omit<Student, "id">) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...student,
                createdAt: Timestamp.now(),
            });
            return { id: docRef.id, ...student };
        } catch (error) {
            console.error("Error adding student:", error);
            throw error;
        }
    },

    getStudents: async () => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Student[];
        } catch (error) {
            console.error("Error getting students:", error);
            throw error;
        }
    },

    getStudentsByClass: async (grade: string) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("grade", "==", grade),
                orderBy("fullName")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Student[];
        } catch (error) {
            console.error("Error getting students by class:", error);
            throw error;
        }
    },

    updateStudent: async (id: string, data: Partial<Student>) => {
        try {
            const studentRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(studentRef, data);
        } catch (error) {
            console.error("Error updating student:", error);
            throw error;
        }
    },

    deleteStudent: async (id: string) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting student:", error);
            throw error;
        }
    }
};
