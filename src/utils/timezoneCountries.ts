// Mapping of timezone identifiers to their countries/regions
// This helps users search by country name (e.g., "Philippines" -> "Asia/Manila")
export const timezoneToCountry: Record<string, string[]> = {
  // Asia
  "Asia/Manila": ["Philippines", "Philippine"],
  "Asia/Singapore": ["Singapore"],
  "Asia/Tokyo": ["Japan", "Japanese"],
  "Asia/Shanghai": ["China", "Chinese"],
  "Asia/Hong_Kong": ["Hong Kong", "HK"],
  "Asia/Seoul": ["South Korea", "Korea", "Korean"],
  "Asia/Bangkok": ["Thailand", "Thai"],
  "Asia/Jakarta": ["Indonesia", "Indonesian"],
  "Asia/Kuala_Lumpur": ["Malaysia", "Malaysian"],
  "Asia/Ho_Chi_Minh": ["Vietnam", "Vietnamese"],
  "Asia/Dubai": ["UAE", "United Arab Emirates", "Dubai"],
  "Asia/Kolkata": ["India", "Indian"],
  "Asia/Karachi": ["Pakistan", "Pakistani"],
  "Asia/Dhaka": ["Bangladesh", "Bangladeshi"],
  "Asia/Tehran": ["Iran", "Iranian"],
  "Asia/Jerusalem": ["Israel", "Israeli"],
  "Asia/Riyadh": ["Saudi Arabia", "Saudi"],
  "Asia/Istanbul": ["Turkey", "Turkish"],
  
  // Americas
  "America/New_York": ["USA", "United States", "US", "New York", "NYC", "Eastern"],
  "America/Chicago": ["USA", "United States", "US", "Chicago", "Central"],
  "America/Denver": ["USA", "United States", "US", "Denver", "Mountain"],
  "America/Los_Angeles": ["USA", "United States", "US", "Los Angeles", "LA", "Pacific"],
  "America/Toronto": ["Canada", "Canadian", "Toronto", "Eastern"],
  "America/Vancouver": ["Canada", "Canadian", "Vancouver", "Pacific"],
  "America/Mexico_City": ["Mexico", "Mexican"],
  "America/Sao_Paulo": ["Brazil", "Brazilian"],
  "America/Buenos_Aires": ["Argentina", "Argentinian"],
  "America/Santiago": ["Chile", "Chilean"],
  "America/Lima": ["Peru", "Peruvian"],
  "America/Bogota": ["Colombia", "Colombian"],
  
  // Europe
  "Europe/London": ["UK", "United Kingdom", "Britain", "British", "England", "London", "GMT"],
  "Europe/Paris": ["France", "French", "Paris"],
  "Europe/Berlin": ["Germany", "German", "Berlin"],
  "Europe/Rome": ["Italy", "Italian", "Rome"],
  "Europe/Madrid": ["Spain", "Spanish", "Madrid"],
  "Europe/Amsterdam": ["Netherlands", "Dutch", "Amsterdam"],
  "Europe/Brussels": ["Belgium", "Belgian", "Brussels"],
  "Europe/Vienna": ["Austria", "Austrian", "Vienna"],
  "Europe/Zurich": ["Switzerland", "Swiss", "Zurich"],
  "Europe/Stockholm": ["Sweden", "Swedish", "Stockholm"],
  "Europe/Oslo": ["Norway", "Norwegian", "Oslo"],
  "Europe/Copenhagen": ["Denmark", "Danish", "Copenhagen"],
  "Europe/Helsinki": ["Finland", "Finnish", "Helsinki"],
  "Europe/Athens": ["Greece", "Greek", "Athens"],
  "Europe/Warsaw": ["Poland", "Polish", "Warsaw"],
  "Europe/Prague": ["Czech Republic", "Czech", "Prague"],
  "Europe/Budapest": ["Hungary", "Hungarian", "Budapest"],
  "Europe/Bucharest": ["Romania", "Romanian", "Bucharest"],
  "Europe/Moscow": ["Russia", "Russian", "Moscow"],
  "Europe/Lisbon": ["Portugal", "Portuguese", "Lisbon"],
  "Europe/Dublin": ["Ireland", "Irish", "Dublin"],
  
  // Australia & Oceania
  "Australia/Sydney": ["Australia", "Australian", "Sydney", "NSW"],
  "Australia/Melbourne": ["Australia", "Australian", "Melbourne", "Victoria"],
  "Australia/Brisbane": ["Australia", "Australian", "Brisbane", "Queensland"],
  "Australia/Perth": ["Australia", "Australian", "Perth", "Western Australia"],
  "Australia/Adelaide": ["Australia", "Australian", "Adelaide", "South Australia"],
  "Pacific/Auckland": ["New Zealand", "NZ", "Auckland"],
  "Pacific/Fiji": ["Fiji", "Fijian"],
  "Pacific/Honolulu": ["Hawaii", "Hawaiian", "Honolulu"],
  
  // Africa
  "Africa/Cairo": ["Egypt", "Egyptian", "Cairo"],
  "Africa/Johannesburg": ["South Africa", "South African", "Johannesburg"],
  "Africa/Lagos": ["Nigeria", "Nigerian", "Lagos"],
  "Africa/Nairobi": ["Kenya", "Kenyan", "Nairobi"],
  "Africa/Casablanca": ["Morocco", "Moroccan", "Casablanca"],
  "Africa/Algiers": ["Algeria", "Algerian", "Algiers"],
};

export function getCountryNames(timezone: string): string[] {
  return timezoneToCountry[timezone] || [];
}

