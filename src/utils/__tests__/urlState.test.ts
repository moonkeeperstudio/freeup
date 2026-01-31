/**
 * Unit tests for localStorage sharing functionality
 */

import {
  createShareLinkFromLocalStorage,
  createShareLinkFromAllLocalStorage,
  restoreLocalStorageFromUrl,
  copyToClipboard,
} from '../urlState';

// Mock the global objects
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
  };
})();

// Setup mocks before tests
beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
});

beforeEach(() => {
  mockLocalStorage.clear();
  jest.clearAllMocks();
  
  // Mock window.history.replaceState
  window.history.replaceState = jest.fn();
});

// No need to mock window.location anymore - we'll pass URLs directly to functions

describe('createShareLinkFromLocalStorage', () => {
  test('should create a share link with specified keys', () => {
    // Setup
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    localStorage.setItem('key3', 'value3');

    // Execute
    const link = createShareLinkFromLocalStorage(['key1', 'key2']);

    // Assert
    expect(link).toContain('?shared=');
    expect(link).toContain('http://localhost');
    
    // Decode and verify the data
    const url = new URL(link);
    const encoded = url.searchParams.get('shared');
    expect(encoded).toBeTruthy();
    
    const decoded = JSON.parse(atob(encoded!));
    expect(decoded).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
    expect(decoded.key3).toBeUndefined();
  });

  test('should handle JSON-stored values', () => {
    // Setup
    const complexData = { theme: 'dark', lang: 'en' };
    localStorage.setItem('settings', JSON.stringify(complexData));

    // Execute
    const link = createShareLinkFromLocalStorage(['settings']);

    // Assert
    const url = new URL(link);
    const encoded = url.searchParams.get('shared');
    const decoded = JSON.parse(atob(encoded!));
    
    expect(decoded.settings).toEqual(complexData);
  });

  test('should return current URL when no keys found', () => {
    // Execute
    const link = createShareLinkFromLocalStorage(['nonexistent']);

    // Assert
    expect(link).toContain('http://localhost');
  });

  test('should ignore null/undefined values', () => {
    // Setup
    localStorage.setItem('key1', 'value1');

    // Execute
    const link = createShareLinkFromLocalStorage(['key1', 'nonexistent']);

    // Assert
    const url = new URL(link);
    const encoded = url.searchParams.get('shared');
    const decoded = JSON.parse(atob(encoded!));
    
    expect(decoded).toEqual({ key1: 'value1' });
  });
});

describe('createShareLinkFromAllLocalStorage', () => {
  test('should create a share link with all localStorage data', () => {
    // Setup
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    localStorage.setItem('key3', JSON.stringify({ nested: true }));

    // Execute
    const link = createShareLinkFromAllLocalStorage();

    // Assert
    expect(link).toContain('?shared=');
    
    const url = new URL(link);
    const encoded = url.searchParams.get('shared');
    const decoded = JSON.parse(atob(encoded!));
    
    expect(decoded.key1).toBe('value1');
    expect(decoded.key2).toBe('value2');
    expect(decoded.key3).toEqual({ nested: true });
  });

  test('should return current URL when localStorage is empty', () => {
    // Execute
    const link = createShareLinkFromAllLocalStorage();

    // Assert
    expect(link).toContain('http://localhost');
  });
});

describe('restoreLocalStorageFromUrl', () => {
  test('should restore localStorage from URL parameter', () => {
    // Setup
    const data = { key1: 'value1', key2: 'value2' };
    const encoded = btoa(JSON.stringify(data));
    const testUrl = `http://localhost:3000/?shared=${encoded}`;

    // Execute
    const restored = restoreLocalStorageFromUrl(false, testUrl);

    // Assert
    expect(restored).toEqual(data);
    expect(localStorage.getItem('key1')).toBe('value1');
    expect(localStorage.getItem('key2')).toBe('value2');
  });

  test('should restore complex JSON objects', () => {
    // Setup
    const data = {
      settings: { theme: 'dark', language: 'en' },
      user: { name: 'John', id: 123 },
    };
    const encoded = btoa(JSON.stringify(data));
    const testUrl = `http://localhost:3000/?shared=${encoded}`;

    // Execute
    const restored = restoreLocalStorageFromUrl(false, testUrl);

    // Assert
    expect(restored).toEqual(data);
    expect(JSON.parse(localStorage.getItem('settings')!)).toEqual(data.settings);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(data.user);
  });

  test('should clean URL when cleanUrl is true', () => {
    // Setup
    const data = { key1: 'value1' };
    const encoded = btoa(JSON.stringify(data));
    const testUrl = `http://localhost:3000/?shared=${encoded}`;

    // Execute
    restoreLocalStorageFromUrl(true, testUrl);

    // Assert
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      '',
      'http://localhost:3000/'
    );
  });

  test('should not clean URL when cleanUrl is false', () => {
    // Setup
    const data = { key1: 'value1' };
    const encoded = btoa(JSON.stringify(data));
    const testUrl = `http://localhost:3000/?shared=${encoded}`;

    // Execute
    restoreLocalStorageFromUrl(false, testUrl);

    // Assert
    expect(window.history.replaceState).not.toHaveBeenCalled();
  });

  test('should return null when no shared parameter exists', () => {
    // Execute
    const restored = restoreLocalStorageFromUrl(true, 'http://localhost:3000/');

    // Assert
    expect(restored).toBeNull();
  });

  test('should return null for invalid base64', () => {
    // Execute
    const restored = restoreLocalStorageFromUrl(true, 'http://localhost:3000/?shared=invalid!!!');

    // Assert
    expect(restored).toBeNull();
  });

  test('should preserve other URL parameters when cleaning', () => {
    // Setup
    const data = { key1: 'value1' };
    const encoded = btoa(JSON.stringify(data));
    const testUrl = `http://localhost:3000/?foo=bar&shared=${encoded}&baz=qux`;

    // Execute
    restoreLocalStorageFromUrl(true, testUrl);

    // Assert
    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      '',
      'http://localhost:3000/?foo=bar&baz=qux'
    );
  });
});

describe('copyToClipboard', () => {
  test('should copy text using clipboard API', async () => {
    // Setup
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    // Execute
    const result = await copyToClipboard('test text');

    // Assert
    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  test('should handle clipboard API errors with fallback', async () => {
    // Setup - mock clipboard to fail
    const mockWriteText = jest.fn().mockRejectedValue(new Error('Permission denied'));
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    // Mock document.execCommand fallback
    const mockExecCommand = jest.fn().mockReturnValue(true);
    document.execCommand = mockExecCommand;
    
    const mockAppendChild = jest.spyOn(document.body, 'appendChild');
    const mockRemoveChild = jest.spyOn(document.body, 'removeChild');

    // Execute
    const result = await copyToClipboard('test text');

    // Assert
    expect(result).toBe(true);
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
  });
});

describe('Integration: Full sharing flow', () => {
  test('should complete full share and restore cycle', () => {
    // Step 1: Store data in localStorage
    localStorage.setItem('timezone', 'America/New_York');
    localStorage.setItem('theme', JSON.stringify({ mode: 'dark' }));
    localStorage.setItem('preferences', 'custom');

    // Step 2: Create share link
    const shareLink = createShareLinkFromLocalStorage(['timezone', 'theme']);
    expect(shareLink).toContain('?shared=');

    // Step 3: Clear localStorage (simulating new user)
    mockLocalStorage.clear();
    expect(localStorage.getItem('timezone')).toBeNull();

    // Step 4: Restore from URL
    const restored = restoreLocalStorageFromUrl(true, shareLink);

    // Step 5: Verify restoration
    expect(restored).toBeTruthy();
    expect(localStorage.getItem('timezone')).toBe('America/New_York');
    expect(JSON.parse(localStorage.getItem('theme')!)).toEqual({ mode: 'dark' });
    expect(localStorage.getItem('preferences')).toBeNull(); // Not included in share
  });
});
