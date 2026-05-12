"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  value,
  onChange,
  onTriggerClick,
  align = "end",
  placeholder = "Pick a date",
  buttonClassName,
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  onTriggerClick?: () => void;
  align?: "start" | "center" | "end";
  placeholder?: string;
  buttonClassName?: string;
}) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });
  const date = value ?? internalDate;
  const handleDateChange = (nextDate: DateRange | undefined) => {
    if (onChange) {
      onChange(nextDate);
      return;
    }
    setInternalDate(nextDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            onClick={onTriggerClick}
            className={cn(
              "w-full justify-start text-left font-normal h-10 border-gray-200 rounded-lg overflow-hidden",
              !date && "text-muted-foreground",
              buttonClassName,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {date?.from ? (
              <span className="truncate">
                {date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
