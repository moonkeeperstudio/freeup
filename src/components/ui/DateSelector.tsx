"use client";

import { DateTime } from "luxon";
import { useRef } from "react";

interface DateSelectorProps {
  selectedDate: DateTime;
  onDateChange: (date: DateTime) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Get today, tomorrow, and day after tomorrow
  const today = DateTime.now();
  const tomorrow = today.plus({ days: 1 });
  const dayAfterTomorrow = today.plus({ days: 2 });

  const quickDates = [
    { date: today, label: today.toFormat("MMM d"), subLabel: "Today" },
    { date: tomorrow, label: tomorrow.toFormat("MMM d"), subLabel: "Tomorrow" },
    { date: dayAfterTomorrow, label: dayAfterTomorrow.toFormat("MMM d"), subLabel: dayAfterTomorrow.toFormat("ccc") },
  ];

  // Check if selected date is one of the quick dates
  const isQuickDate = quickDates.some(
    (item) => selectedDate.toISODate() === item.date.toISODate()
  );

  return (
    <div className="flex items-center gap-2">
      {quickDates.map((item, index) => (
        <button
          key={index}
          onClick={() => onDateChange(item.date)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedDate.toISODate() === item.date.toISODate()
              ? "bg-logo-pink text-white"
              : "bg-transparent text-white hover:bg-white/10"
          }`}
        >
          <div className="flex flex-col items-center">
            <span>{item.label}</span>
            <span className="text-xs opacity-75 mt-0.5">{item.subLabel}</span>
          </div>
        </button>
      ))}
      
      {/* Calendar Picker Button */}
      <button
        onClick={() => dateInputRef.current?.showPicker()}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          !isQuickDate
            ? "bg-logo-pink text-white"
            : "bg-transparent text-white hover:bg-white/10"
        }`}
        title={!isQuickDate ? `Selected: ${selectedDate.toFormat("MMM d, yyyy")}` : "Select a date"}
      >
        {!isQuickDate ? (
          <div className="flex flex-col items-center">
            <span>{selectedDate.toFormat("MMM d")}</span>
            <span className="text-xs opacity-75 mt-0.5">{selectedDate.toFormat("ccc")}</span>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        )}
      </button>
      
      {/* Hidden date input */}
      <input
        ref={dateInputRef}
        type="date"
        className="sr-only"
        value={selectedDate.toISODate() || ""}
        onChange={(e) => {
          const newDate = DateTime.fromISO(e.target.value);
          if (newDate.isValid) {
            onDateChange(newDate);
          }
        }}
      />
    </div>
  );
}

