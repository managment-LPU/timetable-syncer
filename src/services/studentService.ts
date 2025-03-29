
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

// Helper functions for data export
export const exportStudentsToJson = (): string => {
  return JSON.stringify(students, null, 2);
};

export const exportStudentsToCsv = (): string => {
  // CSV header
  let csv = "Id,Name,Registration Number,Roll Number,Day,Free Slots\n";
  
  // Add data rows
  students.forEach(student => {
    student.timeSlots.forEach(timeSlot => {
      if (timeSlot.slots.length > 0) {
        csv += `${student.id},${student.name},${student.regNo},${student.rollNo},${timeSlot.day},"${timeSlot.slots.join(', ')}"\n`;
      }
    });
  });
  
  return csv;
};
