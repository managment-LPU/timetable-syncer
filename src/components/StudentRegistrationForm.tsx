
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TimeSlotSelector from "./TimeSlotSelector";
import { Student, TimeSlot } from "@/models/types";
import { addStudent } from "@/services/studentService";
import { v4 as uuidv4 } from "uuid";

const StudentRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [rollNo, setRollNo] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    days.map(day => ({ day, slots: [] }))
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(days[0]);

  const handleTimeSlotChange = (day: string, slots: string[]) => {
    setTimeSlots(current => 
      current.map(item => item.day === day ? { ...item, slots } : item)
    );
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!regNo.trim()) {
      toast({
        title: "Registration Number Required",
        description: "Please enter your registration number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!rollNo.trim()) {
      toast({
        title: "Roll Number Required",
        description: "Please enter your roll number.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if at least one time slot is selected
    const hasTimeSlots = timeSlots.some(day => day.slots.length > 0);
    if (!hasTimeSlots) {
      toast({
        title: "Time Slots Required",
        description: "Please select at least one free time slot.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newStudent: Student = {
        id: uuidv4(),
        name,
        regNo,
        rollNo,
        timeSlots
      };

      addStudent(newStudent);

      toast({
        title: "Registration Successful",
        description: "Your free time slots have been submitted successfully."
      });

      // Reset form
      setName("");
      setRegNo("");
      setRollNo("");
      setTimeSlots(days.map(day => ({ day, slots: [] })));
      
      // Navigate to success page or home page
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Enter your details and select your free time slots for each day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration Number</Label>
                <Input
                  id="regNo"
                  placeholder="REG12345"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  placeholder="ROLL12345"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Time Slot Selection</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {days.map(day => (
                  <TabsTrigger key={day} value={day}>
                    {day.substring(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {days.map(day => (
                <TabsContent key={day} value={day} className="space-y-6">
                  <TimeSlotSelector
                    day={day}
                    selectedSlots={timeSlots.find(d => d.day === day)?.slots || []}
                    onChange={handleTimeSlotChange}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default StudentRegistrationForm;
