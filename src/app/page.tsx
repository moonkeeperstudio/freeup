"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SearchBar, SearchResult } from "@/components/ui/SearchBar";
import { DateSelector } from "@/components/ui/DateSelector";
import {
  LocationContainer,
  type SelectedTimeRangeUtc,
} from "@/components/LocationContainer";
import { useState, useCallback, useMemo } from "react";
import { useTimezoneSearch } from "@/hooks/useTimezoneSearch";
import { DateTime } from "luxon";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeRangeUtc, setSelectedTimeRangeUtc] =
    useState<SelectedTimeRangeUtc | null>(null);
  const [addedLocations, setAddedLocations] = useState<SearchResult[]>([
    {
      id: "Asia/Manila",
      label: "Manila, Philippines",
      subtitle: "Asia/Manila (GMT+8)",
    },
  ]);

  const selectedDateIso = useMemo(
    () => selectedDate.toISODate() || DateTime.now().toISODate()!,
    [selectedDate]
  );

  /** Shared UTC window for all timelines so selection lines align vertically */
  const { utcWindowStartMs, utcWindowEndMs } = useMemo(() => {
    const start = new Date(selectedDateIso + "T00:00:00.000Z").getTime();
    const end = start + 25 * 60 * 60 * 1000; // 25 hours
    return { utcWindowStartMs: start, utcWindowEndMs: end };
  }, [selectedDateIso]);

  const { searchResults } = useTimezoneSearch(searchQuery);

  const handleSelectTimezone = useCallback((result: SearchResult) => {
    setSearchQuery("");
    setAddedLocations((prev) => {
      if (prev.some((loc) => loc.id === result.id)) return prev;
      return [...prev, result];
    });
  }, []);

  const handleRemoveLocation = useCallback((timezoneId: string) => {
    setAddedLocations((prev) => prev.filter((loc) => loc.id !== timezoneId));
  }, []);

  const handleSelectRange = useCallback((startUtc: number, endUtc: number) => {
    setSelectedTimeRangeUtc({ startUtc, endUtc });
  }, []);

  return (
    <div className="min-h-screen bg-primary px-8 py-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-6 flex-wrap max-w-[1440px] mx-auto w-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="FreeUp"
            width={190}
            height={43}
            priority
            className="h-10 w-auto"
          />
        </div>

        {/* Search & Date Selector & Create Event */}
        <div className="flex items-center gap-4 flex-1 justify-between flex-wrap">
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type Place or Timezone"
            results={searchResults}
            onSelectResult={handleSelectTimezone}
          />

          {/* Date Selector */}
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Create Event Button */}
          <Button
            variant="solid"
            size="normal"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            }
          >
            Create Event
          </Button>
        </div>
      </header>

      {/* Main Content Area - Dynamic location containers */}
      <main className="mt-12 flex flex-col gap-6 max-w-[1440px] mx-auto">
        {addedLocations.map((loc) => (
          <LocationContainer
            key={loc.id}
            timezoneId={loc.id}
            locationLabel={loc.label}
            selectedDateIso={selectedDateIso}
            utcWindowStartMs={utcWindowStartMs}
            utcWindowEndMs={utcWindowEndMs}
            selectedRangeUtc={selectedTimeRangeUtc}
            onSelectRange={handleSelectRange}
            onRemove={
              addedLocations.length > 1
                ? () => handleRemoveLocation(loc.id)
                : undefined
            }
          />
        ))}
      </main>
    </div>
  );
}
