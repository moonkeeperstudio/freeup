// Mapping of timezone identifiers to their countries/regions
// This helps users search by country name (e.g., "Philippines" -> "Asia/Manila")
export const timezoneToCountry: Record<string, string[]> = {
  // Asia
  "Asia/Manila": ["Philippines", "Philippine", "PH", "PHL"],
  "Asia/Singapore": ["Singapore", "SG", "SGP"],
  "Asia/Tokyo": ["Japan", "Japanese", "JP", "JPN"],
  "Asia/Shanghai": ["China", "Chinese", "CN", "CHN"],
  "Asia/Hong_Kong": ["Hong Kong", "HK", "HKG"],
  "Asia/Seoul": ["South Korea", "Korea", "Korean", "KR", "KOR", "SK"],
  "Asia/Bangkok": ["Thailand", "Thai", "TH", "THA"],
  "Asia/Jakarta": ["Indonesia", "Indonesian", "ID", "IDN"],
  "Asia/Kuala_Lumpur": ["Malaysia", "Malaysian", "MY", "MYS", "KL"],
  "Asia/Ho_Chi_Minh": ["Vietnam", "Vietnamese", "VN", "VNM", "Saigon"],
  "Asia/Dubai": ["UAE", "United Arab Emirates", "Dubai", "AE"],
  "Asia/Kolkata": ["India", "Indian", "IN", "IND", "Calcutta"],
  "Asia/Karachi": ["Pakistan", "Pakistani", "PK", "PAK"],
  "Asia/Dhaka": ["Bangladesh", "Bangladeshi", "BD", "BGD"],
  "Asia/Tehran": ["Iran", "Iranian", "IR", "IRN"],
  "Asia/Jerusalem": ["Israel", "Israeli", "IL", "ISR"],
  "Asia/Riyadh": ["Saudi Arabia", "Saudi", "SA", "SAU"],
  "Asia/Istanbul": ["Turkey", "Turkish", "TR", "TUR"],
  
  // Americas
  "America/New_York": ["USA", "United States", "US", "New York", "NYC", "NY", "Eastern", "EST", "EDT"],
  "America/Chicago": ["USA", "United States", "US", "Chicago", "Central", "CST", "CDT"],
  "America/Denver": ["USA", "United States", "US", "Denver", "Mountain", "MST", "MDT"],
  "America/Los_Angeles": ["USA", "United States", "US", "Los Angeles", "LA", "Pacific", "PST", "PDT", "California"],
  "America/Toronto": ["Canada", "Canadian", "CA", "Toronto", "Eastern", "Ontario"],
  "America/Vancouver": ["Canada", "Canadian", "CA", "Vancouver", "Pacific", "BC"],
  "America/Mexico_City": ["Mexico", "Mexican", "MX", "MEX"],
  "America/Sao_Paulo": ["Brazil", "Brazilian", "BR", "BRA"],
  "America/Buenos_Aires": ["Argentina", "Argentinian", "AR", "ARG"],
  "America/Santiago": ["Chile", "Chilean", "CL", "CHL"],
  "America/Lima": ["Peru", "Peruvian", "PE", "PER"],
  "America/Bogota": ["Colombia", "Colombian", "CO", "COL"],
  
  // Europe
  "Europe/London": ["UK", "United Kingdom", "GB", "GBR", "Britain", "British", "England", "London", "GMT", "BST"],
  "Europe/Paris": ["France", "French", "FR", "FRA", "Paris"],
  "Europe/Berlin": ["Germany", "German", "DE", "DEU", "Berlin"],
  "Europe/Rome": ["Italy", "Italian", "IT", "ITA", "Rome"],
  "Europe/Madrid": ["Spain", "Spanish", "ES", "ESP", "Madrid"],
  "Europe/Amsterdam": ["Netherlands", "Dutch", "NL", "NLD", "Amsterdam", "Holland"],
  "Europe/Brussels": ["Belgium", "Belgian", "BE", "BEL", "Brussels"],
  "Europe/Vienna": ["Austria", "Austrian", "AT", "AUT", "Vienna"],
  "Europe/Zurich": ["Switzerland", "Swiss", "CH", "CHE", "Zurich"],
  "Europe/Stockholm": ["Sweden", "Swedish", "SE", "SWE", "Stockholm"],
  "Europe/Oslo": ["Norway", "Norwegian", "NO", "NOR", "Oslo"],
  "Europe/Copenhagen": ["Denmark", "Danish", "DK", "DNK", "Copenhagen"],
  "Europe/Helsinki": ["Finland", "Finnish", "FI", "FIN", "Helsinki"],
  "Europe/Athens": ["Greece", "Greek", "GR", "GRC", "Athens"],
  "Europe/Warsaw": ["Poland", "Polish", "PL", "POL", "Warsaw"],
  "Europe/Prague": ["Czech Republic", "Czech", "CZ", "CZE", "Prague"],
  "Europe/Budapest": ["Hungary", "Hungarian", "HU", "HUN", "Budapest"],
  "Europe/Bucharest": ["Romania", "Romanian", "RO", "ROU", "Bucharest"],
  "Europe/Moscow": ["Russia", "Russian", "RU", "RUS", "Moscow"],
  "Europe/Lisbon": ["Portugal", "Portuguese", "PT", "PRT", "Lisbon"],
  "Europe/Dublin": ["Ireland", "Irish", "IE", "IRL", "Dublin"],
  
  // Australia & Oceania
  "Australia/Sydney": ["Australia", "Australian", "AU", "AUS", "Sydney", "NSW"],
  "Australia/Melbourne": ["Australia", "Australian", "AU", "AUS", "Melbourne", "Victoria", "VIC"],
  "Australia/Brisbane": ["Australia", "Australian", "AU", "AUS", "Brisbane", "Queensland", "QLD"],
  "Australia/Perth": ["Australia", "Australian", "AU", "AUS", "Perth", "Western Australia", "WA"],
  "Australia/Adelaide": ["Australia", "Australian", "AU", "AUS", "Adelaide", "South Australia", "SA"],
  "Pacific/Auckland": ["New Zealand", "NZ", "NZL", "Auckland"],
  "Pacific/Fiji": ["Fiji", "Fijian", "FJ", "FJI"],
  "Pacific/Honolulu": ["Hawaii", "Hawaiian", "HI", "Honolulu"],
  
  // Africa
  "Africa/Cairo": ["Egypt", "Egyptian", "EG", "EGY", "Cairo"],
  "Africa/Johannesburg": ["South Africa", "South African", "ZA", "ZAF", "Johannesburg"],
  "Africa/Lagos": ["Nigeria", "Nigerian", "NG", "NGA", "Lagos"],
  "Africa/Nairobi": ["Kenya", "Kenyan", "KE", "KEN", "Nairobi"],
  "Africa/Casablanca": ["Morocco", "Moroccan", "MA", "MAR", "Casablanca"],
  "Africa/Algiers": ["Algeria", "Algerian", "DZ", "DZA", "Algiers"],
};

export function getCountryNames(timezone: string): string[] {
  return timezoneToCountry[timezone] || [];
}

