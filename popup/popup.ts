import type { CacheStore, CacheEntry, NotFoundEntry } from "../cache";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString();
}

function createFoundArtistElement(entry: CacheEntry): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "entry";
  div.innerHTML = `
    <div>
      ${entry.artistName} <span class="timestamp">(${formatDate(entry.timestamp)})</span>
    </div>
    <a href="${entry.ampwallLink}" target="_blank" class="view-link">View</a>
  `;
  return div;
}

function createNotFoundArtistElement(entry: NotFoundEntry): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "entry";
  div.innerHTML = `
    <div>
      ${entry.artistName} <span class="timestamp">(${formatDate(entry.timestamp)})</span>
    </div>
  `;
  return div;
}

async function loadCacheData(): Promise<void> {
  const result = await chrome.storage.local.get("ampwall_artists");
  const store: CacheStore = result.ampwall_artists || {
    artists: [],
    notFound: [],
  };

  const foundArtistsContainer = document.getElementById("foundArtists");
  const notFoundArtistsContainer = document.getElementById("notFoundArtists");

  if (foundArtistsContainer) {
    foundArtistsContainer.innerHTML = `<div class="entry"><b>Found Artists (${store.artists.length})</b></div>`;
    for (const entry of store.artists) {
      foundArtistsContainer.appendChild(createFoundArtistElement(entry));
    }
  }

  if (notFoundArtistsContainer) {
    notFoundArtistsContainer.innerHTML = `<div class="entry"><b>Not Found (${store.notFound.length})</b></div>`;
    for (const entry of store.notFound) {
      notFoundArtistsContainer.appendChild(createNotFoundArtistElement(entry));
    }
  }
}

async function clearCache(): Promise<void> {
  await chrome.storage.local.set({
    ampwall_artists: { artists: [], notFound: [] },
  });
  await loadCacheData();
}

document.addEventListener("DOMContentLoaded", () => {
  loadCacheData();

  const clearButton = document.getElementById("clearCache");
  if (clearButton) {
    clearButton.addEventListener("click", clearCache);
  }
});
