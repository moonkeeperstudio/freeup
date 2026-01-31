"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface TimezoneDisplayProps {
  timezone: string;
  onRemove?: () => void;
}

export function TimezoneDisplay({ timezone, onRemove }: TimezoneDisplayProps) {
  const [currentTime, setCurrentTime] = useState<DateTime>(
    DateTime.now().setZone(timezone)
  );

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now().setZone(timezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  const offset = currentTime.offset / 60;
  const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary mb-1">
            {timezone.split("/")[1]?.replace(/_/g, " ") || timezone}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {timezone} (GMT{offsetStr})
          </p>

          <div className="text-4xl font-bold text-logo-pink mb-2">
            {currentTime.toFormat("HH:mm:ss")}
          </div>

          <p className="text-gray-600">
            {currentTime.toFormat("EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-logo-pink transition-colors"
            aria-label="Remove timezone"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
