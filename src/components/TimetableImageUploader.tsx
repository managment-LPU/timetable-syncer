
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface TimetableImageUploaderProps {
  day: string;
  imageUrl: string | null;
  onImageUpload: (day: string, imageUrl: string) => void;
  onImageRemove: (day: string) => void;
}

const TimetableImageUploader: React.FC<TimetableImageUploaderProps> = ({
  day,
  imageUrl,
  onImageUpload,
  onImageRemove,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    // Using URL.createObjectURL for this demo app
    // In a real app, you might upload to a server or cloud storage
    const url = URL.createObjectURL(file);
    onImageUpload(day, url);
    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`timetable-${day}`} className="text-sm font-medium">
        {day} Timetable Image
      </Label>
      
      {imageUrl ? (
        <Card className="relative overflow-hidden p-1">
          <img 
            src={imageUrl} 
            alt={`${day} timetable`} 
            className="w-full h-40 object-cover rounded"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={() => onImageRemove(day)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="flex items-center justify-center w-full">
          <Label
            htmlFor={`timetable-${day}`}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-500" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 10MB)</p>
            </div>
            <input
              id={`timetable-${day}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </Label>
        </div>
      )}
    </div>
  );
};

export default TimetableImageUploader;
