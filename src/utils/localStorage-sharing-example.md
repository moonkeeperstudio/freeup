# localStorage Sharing Functionality

This module provides utilities to serialize localStorage data into shareable URLs and restore it when someone opens the link.

## How It Works

1. **Store data in localStorage** (as you normally would in your components)
2. **Create a share link** that encodes specific localStorage keys
3. **Share the link** with others
4. **When opened**, the link automatically restores the localStorage data

## Basic Usage

### 1. In Your Root Component/Layout

Add the hook to automatically restore localStorage from shared URLs:

```typescript
import { useRestoreSharedLocalStorage } from '@/hooks/useSharedState';

export default function RootLayout() {
  // This will automatically check for shared localStorage in the URL
  // and restore it when the page loads
  useRestoreSharedLocalStorage();

  return (
    // your layout...
  );
}
```

### 2. Store Data in localStorage

In any component, store data as you normally would:

```typescript
// Store some data
localStorage.setItem(
  "userPreferences",
  JSON.stringify({
    theme: "dark",
    language: "en",
  })
);

localStorage.setItem("selectedTimezone", "America/New_York");
localStorage.setItem("viewMode", "grid");
```

### 3. Add a Share Button

Use the `ShareButton` component to create shareable links:

```typescript
import { ShareButton } from '@/components/ShareButton';

// Option 1: Share specific localStorage keys
<ShareButton
  localStorageKeys={['userPreferences', 'selectedTimezone', 'viewMode']}
/>

// Option 2: Share ALL localStorage
<ShareButton />
```

## API Reference

### `createShareLinkFromLocalStorage(keys: string[])`

Creates a shareable URL with specific localStorage keys.

```typescript
import { createShareLinkFromLocalStorage } from "@/utils/urlState";

const link = createShareLinkFromLocalStorage(["key1", "key2"]);
// Returns: https://yoursite.com/?shared=eyJrZXkxIjoidmFsdWUxIiwia2V5MiI6InZhbHVlMiJ9
```

### `createShareLinkFromAllLocalStorage()`

Creates a shareable URL with ALL localStorage data.

```typescript
import { createShareLinkFromAllLocalStorage } from "@/utils/urlState";

const link = createShareLinkFromAllLocalStorage();
```

### `restoreLocalStorageFromUrl(cleanUrl?: boolean)`

Manually restore localStorage from URL (usually handled by the hook).

```typescript
import { restoreLocalStorageFromUrl } from "@/utils/urlState";

// Restore and clean URL
const data = restoreLocalStorageFromUrl(true);

// Restore but keep URL parameter
const data = restoreLocalStorageFromUrl(false);
```

## Example Scenario

```typescript
// Component A: User configures their view
function ConfigPanel() {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    // Store in localStorage
    localStorage.setItem('timezone', timezone);
  }, [timezone]);

  return (
    <div>
      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        <option value="UTC">UTC</option>
        <option value="America/New_York">New York</option>
      </select>

      <ShareButton localStorageKeys={['timezone']} />
    </div>
  );
}

// Component B: Receives the shared link
// When someone opens the shared link, the hook automatically restores
// localStorage, so this component can just read from it

function ViewPanel() {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    // Read from localStorage (which was restored from URL)
    const saved = localStorage.getItem('timezone');
    if (saved) setTimezone(saved);
  }, []);

  return <div>Current timezone: {timezone}</div>;
}
```

## How the URL Encoding Works

- Data is serialized to JSON
- JSON is encoded to base64
- Base64 is added as a URL parameter: `?shared=...`
- When the page loads, the hook:
  1. Detects the `shared` parameter
  2. Decodes and parses the data
  3. Restores it to localStorage
  4. Removes the URL parameter (so the URL looks clean)
