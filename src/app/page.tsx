"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("Jan 27");
  const [searchQuery, setSearchQuery] = useState("");

  const dates = ["Jan 27", "Jan 28", "Jan 29"];

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
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <input
              type="text"
              placeholder="Type Place or Timezone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-logo-pink transition-shadow"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-logo-pink hover:text-[#e86d8f] transition-colors"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

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
