"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SearchBar, SearchResult } from "@/components/ui/SearchBar";
import { useState } from "react";
import { useTimezoneSearch } from "@/hooks/useTimezoneSearch";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("Jan 27");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  const dates = ["Jan 27", "Jan 28", "Jan 29"];

  // Use custom hook for timezone search
  const { searchResults } = useTimezoneSearch(searchQuery);

  const handleSelectTimezone = (result: SearchResult) => {
    setSearchQuery(""); // Clear the search bar
    setSelectedTimezone(result.id); // Store the selected timezone ID (e.g., "Asia/Manila")
    console.log("Selected timezone:", result.id);
  };

  return (
    <div className="min-h-screen bg-primary px-8 py-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-6 flex-wrap">
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
          <div className="flex items-center gap-2">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedDate === date
                    ? "bg-logo-pink text-white"
                    : "bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {date}
              </button>
            ))}
          </div>

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

      {/* Main Content Area */}
      <main className="mt-12">
        {/* Time grid and content will go here */}
      </main>
    </div>
  );
}
