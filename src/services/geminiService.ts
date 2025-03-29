
import { Student, CommonSlot } from "@/models/types";

// Gemini API key
const API_KEY = "AIzaSyCC9ztiIqh1ZEgad91zwh1230OVvDibS0Q";

export async function analyzeCommonSlots(students: Student[]): Promise<CommonSlot[]> {
  try {
    if (students.length === 0) {
      return [];
    }

    const studentData = students.map(student => ({
      name: student.name,
      regNo: student.regNo,
      timeSlots: student.timeSlots
    }));

    const prompt = `
      I have data from ${students.length} students about their free time slots.
      Here is the data: ${JSON.stringify(studentData)}
      
      Please analyze this data and find common time slots when all students are free for each day of the week.
      Return the result as a JSON array where each object has:
      - day: the name of the day
      - availableSlots: array of time slots when ALL students are free
      - students: array of student names who are free in these slots
      
      Return ONLY the JSON without any additional text.
    `;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await response.json();
    console.log("Gemini API response:", data);

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the returned text
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const commonSlots: CommonSlot[] = JSON.parse(jsonMatch[0]);
        return commonSlots;
      }
    } catch (error) {
      console.error("Failed to parse JSON from Gemini response:", error);
    }

    // Fallback: If we can't parse the AI's response, generate a basic analysis
    return generateBasicAnalysis(students);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return generateBasicAnalysis(students);
  }
}

// Fallback function if the API fails
function generateBasicAnalysis(students: Student[]): CommonSlot[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const result: CommonSlot[] = [];

  days.forEach(day => {
    // Find slots for current day for each student
    const daySlots = students.map(student => {
      const dayData = student.timeSlots.find(slot => slot.day === day);
      return {
        name: student.name,
        slots: dayData ? dayData.slots : []
      };
    });

    // Find common slots (if any students have data)
    if (daySlots.length > 0 && daySlots.some(s => s.slots.length > 0)) {
      // Start with the first student's slots
      let commonSlots = [...daySlots[0].slots];
      
      // Intersect with each other student's slots
      for (let i = 1; i < daySlots.length; i++) {
        commonSlots = commonSlots.filter(slot => 
          daySlots[i].slots.includes(slot)
        );
      }

      // Collect names of students who are free during these common slots
      const availableStudents = students
        .filter(student => {
          const dayData = student.timeSlots.find(slot => slot.day === day);
          if (!dayData) return false;
          
          // Check if student has all common slots
          return commonSlots.every(slot => dayData.slots.includes(slot));
        })
        .map(student => student.name);

      result.push({
        day,
        availableSlots: commonSlots,
        students: availableStudents
      });
    } else {
      // No data for this day
      result.push({
        day,
        availableSlots: [],
        students: []
      });
    }
  });

  return result;
}
