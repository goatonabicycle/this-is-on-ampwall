interface AmpwallArtist {
	name: string;
	artistLink: string;
	similarityScore: number;
}

interface AmpwallSearchResponse {
	status: string;
	data: {
		results: AmpwallArtist[];
	};
}

async function searchAmpwall(
	artistName: string,
): Promise<AmpwallSearchResponse | null> {
	const response = await chrome.runtime.sendMessage({
		type: "AMPWALL_SEARCH",
		artistName,
	});
	return response?.success ? response.data : null;
}

function getArtistName(): string | null {
	const bandcampTitleSelectors = [
		"#name-section a",
		"#band-name-location .title",
		"#band-name",
	];

	for (const selector of bandcampTitleSelectors) {
		const element = document.querySelector(selector);
		if (element?.textContent) {
			return element.textContent.trim();
		}
	}

	return null;
}

function createAmpwallBanner(artist: AmpwallArtist) {
	const wrapper = document.createElement("div");
	wrapper.className = "ampwall-banner-wrapper";

	const banner = document.createElement("div");
	banner.className = "ampwall-banner";
	banner.innerHTML = `
    <div class="ampwall-banner-content">
      <a href="${artist.artistLink}" target="_blank" class="ampwall-banner-link">
        View on <img src="${chrome.runtime.getURL("images/ampwall-logo.png")}" alt="Ampwall" class="ampwall-banner-logo">
      </a>
    </div>
  `;

	const spacer = document.createElement("div");
	spacer.className = "ampwall-banner-spacer";

	wrapper.appendChild(banner);

	return { wrapper, spacer };
}

async function init() {
	const artistName = getArtistName();
	if (!artistName) return;

	console.log("this-is-on-ampwall -> Found artist:", artistName);
	const searchResult = await searchAmpwall(artistName);

	if (searchResult?.status === "success") {
		const exactMatch = searchResult.data.results.find(
			(artist) => artist.similarityScore === 1,
		);

		if (exactMatch) {
			console.log("this-is-on-ampwall -> Found on Ampwall:", exactMatch.name);
			const { wrapper, spacer } = createAmpwallBanner(exactMatch);
			document.body.prepend(spacer);
			document.body.prepend(wrapper);
		}
	}
}

init();
