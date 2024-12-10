export interface CacheEntry {
  artistName: string;
  ampwallLink: string;
  timestamp: number;
}

export interface NotFoundEntry {
  artistName: string;
  timestamp: number;
}

export interface CacheStore {
  artists: CacheEntry[];
  notFound: NotFoundEntry[];
}

const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

async function getStore(): Promise<CacheStore> {
  const result = await chrome.storage.local.get("ampwall_artists");
  return result.ampwall_artists || { artists: [], notFound: [] };
}

async function cleanExpiredEntries(): Promise<void> {
  const store = await getStore();
  const now = Date.now();

  const validArtists = store.artists.filter(
    (entry) => now - entry.timestamp < MONTH_IN_MS,
  );

  const validNotFound = store.notFound.filter(
    (entry) => now - entry.timestamp < WEEK_IN_MS,
  );

  if (
    validArtists.length < store.artists.length ||
    validNotFound.length < store.notFound.length
  ) {
    await chrome.storage.local.set({
      ampwall_artists: { artists: validArtists, notFound: validNotFound },
    });
  }
}

export async function getCachedArtist(
  artistName: string,
): Promise<CacheEntry | null> {
  await cleanExpiredEntries();
  const store = await getStore();

  return (
    store.artists.find(
      (entry) => entry.artistName.toLowerCase() === artistName.toLowerCase(),
    ) || null
  );
}

export async function isNotFoundArtist(artistName: string): Promise<boolean> {
  await cleanExpiredEntries();
  const store = await getStore();

  return store.notFound.some(
    (entry) => entry.artistName.toLowerCase() === artistName.toLowerCase(),
  );
}

export async function storeArtist(
  artistName: string,
  ampwallLink: string,
): Promise<void> {
  await cleanExpiredEntries();
  const store = await getStore();

  const newEntry: CacheEntry = {
    artistName,
    ampwallLink,
    timestamp: Date.now(),
  };

  const existingIndex = store.artists.findIndex(
    (entry) => entry.artistName.toLowerCase() === artistName.toLowerCase(),
  );

  if (existingIndex >= 0) {
    store.artists[existingIndex] = newEntry;
  } else {
    store.artists.push(newEntry);
  }

  store.notFound = store.notFound.filter(
    (entry) => entry.artistName.toLowerCase() !== artistName.toLowerCase(),
  );

  await chrome.storage.local.set({ ampwall_artists: store });
}

export async function storeNotFoundArtist(artistName: string): Promise<void> {
  await cleanExpiredEntries();
  const store = await getStore();

  const newEntry: NotFoundEntry = {
    artistName,
    timestamp: Date.now(),
  };

  const existingIndex = store.notFound.findIndex(
    (entry) => entry.artistName.toLowerCase() === artistName.toLowerCase(),
  );

  if (existingIndex >= 0) {
    store.notFound[existingIndex] = newEntry;
  } else {
    store.notFound.push(newEntry);
  }

  await chrome.storage.local.set({ ampwall_artists: store });
}
