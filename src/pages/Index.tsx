
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-timetable-blue to-timetable-purple bg-clip-text text-transparent">
            Timetable Sync
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Easily coordinate free time slots among students
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button 
              onClick={() => navigate("/register")}
              className="bg-timetable-blue hover:bg-timetable-indigo transition-colors px-8 py-6 text-lg"
            >
              Register Your Timetable
            </Button>
            <Button 
              onClick={() => navigate("/admin")}
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Admin Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white/50 backdrop-blur-sm border-timetable-blue/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-timetable-blue/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-timetable-blue">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 3v18" />
                    <path d="M16 3v18" />
                    <path d="M3 8h18" />
                    <path d="M3 16h18" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Register Timetables</h3>
                <p className="text-gray-500 text-sm">
                  Input your free time slots and upload your timetable images
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-timetable-purple/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-timetable-purple/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-timetable-purple">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                <p className="text-gray-500 text-sm">
                  Our AI automatically extracts free slots from your timetable images
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-timetable-indigo/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-timetable-indigo/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-timetable-indigo">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Find Common Slots</h3>
                <p className="text-gray-500 text-sm">
                  Automatically discover when everyone is available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
