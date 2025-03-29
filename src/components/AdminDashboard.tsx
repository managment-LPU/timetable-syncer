
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getAllStudents, exportStudentsToJson, exportStudentsToCsv } from "@/services/studentService";
import { analyzeCommonSlots } from "@/services/geminiService";
import { Student, CommonSlot } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [commonSlots, setCommonSlots] = useState<CommonSlot[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("Monday");
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

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

  const toggleStudentExpand = (studentId: string) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const exportToJson = () => {
    if (students.length === 0) {
      toast({
        title: "No Data Available",
        description: "There are no students to export.",
        variant: "destructive"
      });
      return;
    }

    const dataStr = exportStudentsToJson();
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `student-timetable-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast({
      title: "Export Successful",
      description: `Data exported as ${exportFileName}`
    });
  };

  const exportToCsv = () => {
    if (students.length === 0) {
      toast({
        title: "No Data Available",
        description: "There are no students to export.",
        variant: "destructive"
      });
      return;
    }

    const csvContent = exportStudentsToCsv();
    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    const exportFileName = `student-timetable-data-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast({
      title: "Export Successful",
      description: `Data exported as ${exportFileName}`
    });
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
        <div className="flex flex-wrap gap-2">
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
          <Button 
            variant="outline" 
            onClick={exportToJson}
            disabled={students.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button 
            variant="outline" 
            onClick={exportToCsv}
            disabled={students.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
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
                      
                      <Collapsible open={expandedStudents[student.id]} onOpenChange={() => toggleStudentExpand(student.id)}>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {student.timeSlots
                            .filter(slot => slot.slots.length > 0)
                            .slice(0, expandedStudents[student.id] ? undefined : 2)
                            .map(slot => (
                              <Badge key={slot.day} variant="outline">
                                {slot.day.substring(0, 3)}: {slot.slots.length} slots
                              </Badge>
                            ))}
                          
                          {student.timeSlots.filter(slot => slot.slots.length > 0).length > 2 && !expandedStudents[student.id] && (
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-0 h-6">
                                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                                  +more <ChevronDown className="h-3 w-3 ml-1" />
                                </Badge>
                              </Button>
                            </CollapsibleTrigger>
                          )}
                        </div>
                        
                        <CollapsibleContent>
                          {student.timeSlots.filter(slot => slot.slots.length > 0).length > 0 && (
                            <div className="mt-2">
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-6">
                                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                                    Show less <ChevronUp className="h-3 w-3 ml-1" />
                                  </Badge>
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
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
                      {isMobile ? day.substring(0, 3) : day}
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
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Registration No.</TableHead>
                                  <TableHead className="hidden sm:table-cell">Roll No.</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {students
                                  .filter(student => dayData.students.includes(student.name))
                                  .map(student => (
                                    <TableRow key={student.id}>
                                      <TableCell>{student.name}</TableCell>
                                      <TableCell>{student.regNo}</TableCell>
                                      <TableCell className="hidden sm:table-cell">{student.rollNo}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
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
