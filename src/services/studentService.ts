import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from "firebase/firestore";

export interface Student {
    id?: string;
    studentCode?: string; // Human readable ID (e.g. DT-1001)
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
    getNextStudentCode: async () => {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("studentCode", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                return "DT-1001";
            }
            const lastCode = querySnapshot.docs[0].data().studentCode;
            if (!lastCode || !lastCode.startsWith("DT-")) {
                return "DT-1001";
            }
            const lastNumber = parseInt(lastCode.split("-")[1]);
            return `DT-${lastNumber + 1}`;
        } catch (error) {
            console.error("Error generating next student code:", error);
            return "DT-1001"; // Fallback
        }
    },

    addStudent: async (student: Omit<Student, "id" | "studentCode">) => {
        try {
            const studentCode = await studentService.getNextStudentCode();
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...student,
                studentCode,
                createdAt: Timestamp.now(),
            });
            return { id: docRef.id, studentCode, ...student };
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

            // Backward Compatibility: If studentCode is missing, generate it on first edit
            const currentDoc = await getDoc(studentRef);
            if (currentDoc.exists()) {
                const currentData = currentDoc.data() as Student;
                if (!currentData.studentCode) {
                    const nextCode = await studentService.getNextStudentCode();
                    data.studentCode = nextCode;
                }
            }

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
