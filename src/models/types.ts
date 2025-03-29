
export interface TimeSlot {
  day: string;
  slots: string[];
}

export interface Student {
  id: string;
  name: string;
  regNo: string;
  rollNo: string;
  timeSlots: TimeSlot[];
  timetableImages: {
    [key: string]: string; // Day -> Image URL
  };
}

export interface CommonSlot {
  day: string;
  availableSlots: string[];
  students: string[];
}
