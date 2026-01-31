/**
 * Utility functions for encoding and decoding localStorage data to/from URL parameters
 */

export type LocalStorageData = Record<string, unknown>;

/**
 * Captures specific keys from localStorage and encodes them into a shareable URL
 * @param keys - Array of localStorage keys to include in the URL
 * @returns A URL with the encoded localStorage data
 */
export function createShareLinkFromLocalStorage(keys: string[]): string {
  try {
    const data: LocalStorageData = {};

    // Collect data from localStorage for specified keys
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        try {
          // Try to parse as JSON first (in case it's stored as JSON)
          data[key] = JSON.parse(value);
        } catch {
          // If not JSON, store as string
          data[key] = value;
        }
      }
    });

    // If no data found, return current URL
    if (Object.keys(data).length === 0) {
      console.warn("No localStorage data found for specified keys");
      return window.location.href;
    }

    // Convert to JSON and encode to base64
    const jsonString = JSON.stringify(data);
    const base64 = btoa(jsonString);

    // Create URL with encoded state
    const url = new URL(window.location.href);
    url.searchParams.set("shared", base64);

    return url.toString();
  } catch (error) {
    console.error("Error creating share link from localStorage:", error);
    return window.location.href;
  }
}

/**
 * Captures ALL localStorage data and encodes it into a shareable URL
 * @returns A URL with all localStorage data encoded
 */
export function createShareLinkFromAllLocalStorage(): string {
  try {
    const data: LocalStorageData = {};

    // Get all keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }
    }

    if (Object.keys(data).length === 0) {
      console.warn("No localStorage data found");
      return window.location.href;
    }

    const jsonString = JSON.stringify(data);
    const base64 = btoa(jsonString);

    const url = new URL(window.location.href);
    url.searchParams.set("shared", base64);

    return url.toString();
  } catch (error) {
    console.error("Error creating share link:", error);
    return window.location.href;
  }
}

/**
 * Restores localStorage data from a URL parameter
 * This should be called on page load to restore shared state
 * @param cleanUrl - Whether to remove the 'shared' parameter from URL after restoring (default: true)
 * @param url - Optional URL string to restore from (defaults to window.location.href)
 * @returns The restored data object, or null if no data found
 */
export function restoreLocalStorageFromUrl(
  cleanUrl: boolean = true,
  url?: string
): LocalStorageData | null {
  try {
    const urlObj = new URL(url || window.location.href);
    const sharedParam = urlObj.searchParams.get("shared");

    if (!sharedParam) {
      return null;
    }

    // Decode from base64 and parse JSON
    const jsonString = atob(sharedParam);
    const data = JSON.parse(jsonString) as LocalStorageData;

    // Restore to localStorage
    Object.entries(data).forEach(([key, value]) => {
      try {
        // If value is an object, stringify it; otherwise store as-is
        const stringValue =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
      } catch (error) {
        console.error(`Error restoring localStorage key "${key}":`, error);
      }
    });

    console.log("Restored localStorage from URL:", Object.keys(data));

    // Clean up URL by removing the 'shared' parameter
    if (cleanUrl && typeof window !== "undefined") {
      urlObj.searchParams.delete("shared");
      window.history.replaceState({}, "", urlObj.toString());
    }

    return data;
  } catch (error) {
    console.error("Error restoring localStorage from URL:", error);
    return null;
  }
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error("Fallback copy failed:", fallbackError);
      return false;
    }
  }
}
