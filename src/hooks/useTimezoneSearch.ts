import { useMemo } from "react";
import uFuzzy from "@leeoniya/ufuzzy";
import { DateTime } from "luxon";
import { getCountryNames } from "@/utils/timezoneCountries";
import { SearchResult } from "@/components/ui/SearchBar";

interface TimezoneData {
  id: string;
  name: string;
  offset: number;
  offsetStr: string;
  region: string;
  city: string;
  subCity: string;
  searchableString: string;
}

export function useTimezoneSearch(searchQuery: string) {
  // Create enriched timezone data with offsets and place names
  const timezoneData = useMemo<TimezoneData[]>(() => {
    const tzNames = Intl.supportedValuesOf("timeZone");
    
    return tzNames.map((tz) => {
      // Get offset using Luxon
      const dt = DateTime.now().setZone(tz);
      const offset = dt.offset / 60; // Convert minutes to hours
      const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
      
      // Extract place names from timezone (e.g., "Asia/Manila" -> ["Asia", "Manila"])
      const parts = tz.split("/");
      const region = parts[0] || "";
      const city = parts[1]?.replace(/_/g, " ") || "";
      const subCity = parts[2]?.replace(/_/g, " ") || "";
      
      // Get country names for this timezone
      const countryNames = getCountryNames(tz);
      
      // Create searchable string with timezone, places, countries, and various offset formats
      const searchableString = [
        tz,
        region,
        city,
        subCity,
        ...countryNames,
        `GMT${offsetStr}`,
        `UTC${offsetStr}`,
        `+${Math.abs(offset)}`,
        `${offset}`,
        offset.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      
      return {
        id: tz,
        name: tz,
        offset,
        offsetStr,
        region,
        city,
        subCity,
        searchableString,
      };
    });
  }, []);

  // Create array of searchable strings for uFuzzy
  const searchableStrings = useMemo(() => {
    return timezoneData.map((tz) => tz.searchableString);
  }, [timezoneData]);

  // Initialize uFuzzy for fuzzy searching with more lenient settings
  const fuzzy = useMemo(() => {
    return new uFuzzy({
      intraMode: 1,     // Allow more gaps between matched chars
      intraIns: 1,      // Allow insertions within words
      intraSub: 1,      // Allow substitutions within words
      intraTrn: 1,      // Allow transpositions within words
      intraDel: 1,      // Allow deletions within words
    });
  }, []);

  // Popular timezones to show by default
  const popularTimezones = useMemo(() => {
    const popular = [
      "America/New_York",
      "America/Los_Angeles",
      "America/Chicago",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Singapore",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Manila",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

    return popular
      .map((tzId) => timezoneData.find((tz) => tz.id === tzId))
      .filter((tz): tz is TimezoneData => tz !== undefined)
      .map((tz) => {
        const offsetStr = tz.offset >= 0 ? `+${tz.offset}` : `${tz.offset}`;
        const displayParts = [tz.city, tz.region].filter(Boolean);
        const displayName =
          displayParts.length > 0 ? displayParts.join(", ") : tz.name;

        return {
          id: tz.id,
          label: displayName,
          subtitle: `${tz.name} (GMT${offsetStr})`,
        };
      });
  }, [timezoneData]);

  // Perform fuzzy search on timezones
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) {
      return popularTimezones; // Show popular timezones when no query
    }

    const idxs = fuzzy.filter(searchableStrings, searchQuery);
    if (!idxs || idxs.length === 0) {
      return [];
    }

    const info = fuzzy.info(idxs, searchableStrings, searchQuery);
    const order = fuzzy.sort(info, searchableStrings, searchQuery);

    // Take top 10 results
    return order.slice(0, 10).map((idx) => {
      const tz = timezoneData[info.idx[idx]];
      const offsetStr = tz.offset >= 0 ? `+${tz.offset}` : `${tz.offset}`;
      
      // Create friendly display label
      const displayParts = [tz.city, tz.region].filter(Boolean);
      const displayName = displayParts.length > 0 
        ? displayParts.join(", ")
        : tz.name;
      
      return {
        id: tz.id,
        label: displayName,
        subtitle: `${tz.name} (GMT${offsetStr})`,
      };
    });
  }, [searchQuery, searchableStrings, timezoneData, fuzzy, popularTimezones]);

  return {
    searchResults,
    timezoneData,
  };
}

