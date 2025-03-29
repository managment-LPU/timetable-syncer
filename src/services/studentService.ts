
import { Student, CommonSlot } from "@/models/types";

// In-memory storage for our application
const students: Student[] = [];

export const addStudent = (student: Student): void => {
  students.push(student);
};

export const getAllStudents = (): Student[] => {
  return [...students];
};

export const getStudentById = (id: string): Student | undefined => {
  return students.find((s) => s.id === id);
};

export const clearStudents = (): void => {
  students.length = 0;
};
