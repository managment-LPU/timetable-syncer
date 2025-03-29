
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TimeSlot } from "@/models/types";

interface TimeSlotSelectorProps {
  day: string;
  selectedSlots: string[];
  onChange: (day: string, slots: string[]) => void;
}

const DEFAULT_TIME_SLOTS = [
  "8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
  "16:00-17:00", "17:00-18:00"
];

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ day, selectedSlots, onChange }) => {
  const handleSlotChange = (slot: string, isChecked: boolean) => {
    if (isChecked) {
      onChange(day, [...selectedSlots, slot]);
    } else {
      onChange(day, selectedSlots.filter(s => s !== slot));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{day} Slots</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {DEFAULT_TIME_SLOTS.map((slot) => (
          <div key={`${day}-${slot}`} className="flex items-start space-x-2">
            <Checkbox
              id={`${day}-${slot}`}
              checked={selectedSlots.includes(slot)}
              onCheckedChange={(checked) => handleSlotChange(slot, checked === true)}
            />
            <Label
              htmlFor={`${day}-${slot}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {slot}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
