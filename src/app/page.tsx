"use client";

import Image from "next/image";
import { SearchBar, SearchResult } from "@/components/ui/SearchBar";
import { DateSelector } from "@/components/ui/DateSelector";
import {
  LocationContainer,
  type SelectedTimeRangeUtc,
} from "@/components/LocationContainer";
import { ShareStateButton } from "@/components/ShareStateButton";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useSharedState } from "@/hooks/useSharedState";
import { useTimezoneSearch } from "@/hooks/useTimezoneSearch";
import { DateTime } from "luxon";

export default function Home() {
  // Use shared state for date (stored as ISO string)
  const [selectedDateIsoShared, setSelectedDateIsoShared] =
    useSharedState<string>("selectedDate", "");

  // Convert ISO string to DateTime for use in the component, defaulting to today
  const selectedDate = useMemo(() => {
    if (!selectedDateIsoShared) return DateTime.now();
    const parsed = DateTime.fromISO(selectedDateIsoShared);
    return parsed.isValid ? parsed : DateTime.now();
  }, [selectedDateIsoShared]);

  const setSelectedDate = useCallback(
    (date: DateTime) => {
      setSelectedDateIsoShared(date.toISODate() || "");
    },
    [setSelectedDateIsoShared]
  );

  // Set initial date to today if not already set
  useEffect(() => {
    if (!selectedDateIsoShared) {
      setSelectedDateIsoShared(DateTime.now().toISODate() || "");
    }
  }, [selectedDateIsoShared, setSelectedDateIsoShared]);

  const [searchQuery, setSearchQuery] = useState("");

  // Use shared state for selected time range
  const [selectedTimeRangeUtc, setSelectedTimeRangeUtc] =
    useSharedState<SelectedTimeRangeUtc | null>("selectedTimeRange", null);

  // Use shared state for added locations
  const [addedLocations, setAddedLocations] = useSharedState<SearchResult[]>(
    "addedLocations",
    [
      {
        id: "Asia/Manila",
        label: "Manila, Philippines",
        subtitle: "Asia/Manila (GMT+8)",
      },
    ]
  );

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

  const handleSelectTimezone = useCallback(
    (result: SearchResult) => {
      setSearchQuery("");
      setAddedLocations((prev) => {
        if (prev.some((loc) => loc.id === result.id)) return prev;
        return [...prev, result];
      });
    },
    [setAddedLocations]
  );

  const handleRemoveLocation = useCallback(
    (timezoneId: string) => {
      setAddedLocations((prev) => prev.filter((loc) => loc.id !== timezoneId));
    },
    [setAddedLocations]
  );

  const handleSelectRange = useCallback(
    (startUtc: number, endUtc: number) => {
      setSelectedTimeRangeUtc({ startUtc, endUtc });
    },
    [setSelectedTimeRangeUtc]
  );

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

        {/* Search & Date Selector & Share Button */}
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

          {/* Share Button */}
          <ShareStateButton variant="solid" size="normal" />
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
