
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllStudents } from "@/services/studentService";
import { analyzeCommonSlots } from "@/services/geminiService";
import { Student, CommonSlot } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [commonSlots, setCommonSlots] = useState<CommonSlot[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("Monday");

  useEffect(() => {
    // Load students
    const loadedStudents = getAllStudents();
    setStudents(loadedStudents);
  }, []);

  const handleAnalyze = async () => {
    if (students.length === 0) {
      toast({
        title: "No Data Available",
        description: "There are no students registered. Please add students first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const results = await analyzeCommonSlots(students);
      setCommonSlots(results);
      toast({
        title: "Analysis Complete",
        description: "Common free time slots have been analyzed successfully."
      });
    } catch (error) {
      console.error("Error analyzing time slots:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze common time slots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage student registration data and analyze common free time slots.
          </p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || students.length === 0}
          className="bg-timetable-indigo hover:bg-timetable-purple transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Common Slots"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Registered Students</CardTitle>
            <CardDescription>
              {students.length} student{students.length !== 1 ? 's' : ''} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students registered yet
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <Card key={student.id} className="p-4">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Reg No: {student.regNo} | Roll No: {student.rollNo}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {student.timeSlots
                          .filter(slot => slot.slots.length > 0)
                          .slice(0, 2)
                          .map(slot => (
                            <Badge key={slot.day} variant="outline">
                              {slot.day.substring(0, 3)}: {slot.slots.length} slots
                            </Badge>
                          ))}
                        {student.timeSlots.filter(slot => slot.slots.length > 0).length > 2 && (
                          <Badge variant="outline">+more</Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Common Free Time Slots</CardTitle>
            <CardDescription>
              Analyze when all students are available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-timetable-indigo" />
                  <p className="text-muted-foreground">
                    Analyzing timetables using AI...
                  </p>
                </div>
              </div>
            ) : commonSlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground h-[400px] flex items-center justify-center">
                <div>
                  <p className="mb-4">No common slots analyzed yet</p>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={students.length === 0}
                    variant="outline"
                  >
                    Run Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                  {days.map(day => (
                    <TabsTrigger key={day} value={day}>
                      {day.substring(0, 3)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {days.map(day => {
                  const dayData = commonSlots.find(slot => slot.day === day);
                  
                  return (
                    <TabsContent key={day} value={day} className="h-[400px] overflow-auto">
                      {!dayData || dayData.availableSlots.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground h-full flex items-center justify-center">
                          <p>No common free slots found for {day}</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-timetable-lightBlue p-4 rounded-lg">
                            <h3 className="font-medium text-timetable-blue mb-2">
                              Common Free Slots for {day}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {dayData.availableSlots.map(slot => (
                                <Badge key={slot} className="bg-timetable-blue text-white">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Available Students</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {dayData.students.map(student => (
                                <Card key={student} className="p-3">
                                  <div className="text-sm">{student}</div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
