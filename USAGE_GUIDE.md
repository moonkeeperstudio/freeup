# Shareable State Usage Guide

The shareable state system allows you to easily share your application state via URLs without thinking about localStorage. Just use the provided hooks and components!

## Quick Start

### 1. Wrap your app with the provider (already done in `layout.tsx`)

```tsx
import { ShareableStateProvider } from "@/contexts/ShareableStateContext";

export default function RootLayout({ children }) {
  return (
    <ShareableStateProvider>
      {children}
    </ShareableStateProvider>
  );
}
```

### 2. Use `useSharedState` instead of `useState`

Replace any `useState` that you want to be shareable with `useSharedState`:

```tsx
import { useSharedState } from "@/hooks/useSharedState";

function MyComponent() {
  // ❌ Old way - not shareable
  const [timezone, setTimezone] = useState("UTC");
  
  // ✅ New way - automatically shareable!
  const [timezone, setTimezone] = useSharedState("timezone", "UTC");
  
  // Works exactly like useState
  setTimezone("America/New_York");
}
```

### 3. Add a Share Button

```tsx
import { ShareStateButton } from "@/components/ShareStateButton";

function MyComponent() {
  return (
    <ShareStateButton 
      variant="outline" 
      size="normal" 
    />
  );
}
```

That's it! The button will automatically:
- Collect all state from `useSharedState` hooks
- Create a shareable URL
- Copy it to clipboard
- When someone opens the URL, the state is automatically restored

## Examples

### Example 1: Simple State Sharing

```tsx
"use client";

import { useSharedState } from "@/hooks/useSharedState";
import { ShareStateButton } from "@/components/ShareStateButton";

export default function Settings() {
  const [theme, setTheme] = useSharedState("theme", "light");
  const [language, setLanguage] = useSharedState("language", "en");
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
      
      <ShareStateButton />
    </div>
  );
}
```

### Example 2: Complex State Objects

```tsx
"use client";

import { useSharedState } from "@/hooks/useSharedState";
import { ShareStateButton } from "@/components/ShareStateButton";

interface UserPreferences {
  notifications: boolean;
  theme: string;
  timezone: string;
}

export default function Preferences() {
  const [prefs, setPrefs] = useSharedState<UserPreferences>("preferences", {
    notifications: true,
    theme: "light",
    timezone: "UTC",
  });
  
  const updatePref = (key: keyof UserPreferences, value: any) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div>
      <input 
        type="checkbox" 
        checked={prefs.notifications}
        onChange={(e) => updatePref("notifications", e.target.checked)}
      />
      
      <ShareStateButton />
    </div>
  );
}
```

### Example 3: Mixing Shared and Non-Shared State

```tsx
"use client";

import { useState } from "react";
import { useSharedState } from "@/hooks/useSharedState";
import { ShareStateButton } from "@/components/ShareStateButton";

export default function MixedState() {
  // Shared state - will be included in share links
  const [selectedDate, setSelectedDate] = useSharedState("selectedDate", "2026-01-31");
  const [timezone, setTimezone] = useSharedState("timezone", "UTC");
  
  // Regular state - NOT shared
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div>
      {/* selectedDate and timezone will be shared */}
      {/* searchQuery and isMenuOpen will NOT be shared */}
      
      <ShareStateButton />
    </div>
  );
}
```

### Example 4: Selective Sharing

If you only want to share specific state keys:

```tsx
import { ShareStateButton } from "@/components/ShareStateButton";

export default function SelectiveSharing() {
  const [userSettings, setUserSettings] = useSharedState("userSettings", {...});
  const [appConfig, setAppConfig] = useSharedState("appConfig", {...});
  const [secretData, setSecretData] = useSharedState("secretData", {...});
  
  return (
    <div>
      {/* Only share userSettings and appConfig, NOT secretData */}
      <ShareStateButton stateKeys={["userSettings", "appConfig"]} />
    </div>
  );
}
```

### Example 5: Custom Share Callback

```tsx
import { ShareStateButton } from "@/components/ShareStateButton";

export default function CustomCallback() {
  const handleShare = (url: string) => {
    console.log("Share URL generated:", url);
    // Could send to analytics, show a modal, etc.
  };
  
  return (
    <ShareStateButton 
      onShare={handleShare}
      variant="solid"
      size="large"
    />
  );
}
```

## Key Benefits

1. **Simple API**: Works exactly like `useState`
2. **No localStorage Knowledge**: The app doesn't need to know about localStorage
3. **Automatic Syncing**: State is automatically saved and restored
4. **URL Restoration**: Opening a shared link automatically restores all state
5. **Type Safe**: Full TypeScript support
6. **Selective Sharing**: Choose which state to share
7. **Mixed State**: Regular `useState` and `useSharedState` work together

## How It Works

1. **`useSharedState`** hooks register themselves with the provider
2. Each hook automatically saves to localStorage when state changes
3. **`ShareStateButton`** collects all registered state keys
4. Creates a URL with encoded state data
5. When someone opens the URL, the provider restores all state from the URL
6. Individual hooks load the restored state from localStorage

## Migration Guide

To migrate existing code:

```tsx
// Before
import { useState } from "react";

const [value, setValue] = useState("initial");

// After
import { useSharedState } from "@/hooks/useSharedState";

const [value, setValue] = useSharedState("uniqueKey", "initial");
```

Just add:
1. A unique key as the first parameter
2. Import from `@/hooks/useSharedState` instead of `react`

That's it! No other changes needed.

