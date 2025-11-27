let isFetching = false;
let processedUsers = new Set();

function extractUsername() {
    const url = window.location.href;
    const regex = /x\.com\/([^\/?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Country flag emojis mapping
const countryFlags = {
    'iran': '🇮🇷',
    'usa': '🇺🇸',
    'united states': '🇺🇸',
    'united kingdom': '🇬🇧',
    'uk': '🇬🇧',
    'canada': '🇨🇦',
    'germany': '🇩🇪',
    'france': '🇫🇷',
    'turkey': '🇹🇷',
    'uae': '🇦🇪',
    'united arab emirates': '🇦🇪',
    'india': '🇮🇳',
    'china': '🇨🇳',
    'japan': '🇯🇵',
    'korea': '🇰🇷',
    'south korea': '🇰🇷',
    'australia': '🇦🇺',
    'brazil': '🇧🇷',
    'russia': '🇷🇺',
    'italy': '🇮🇹',
    'spain': '🇪🇸',
    'netherlands': '🇳🇱',
    'switzerland': '🇨🇭',
    'sweden': '🇸🇪',
    'norway': '🇳🇴',
    'denmark': '🇩🇰',
    'finland': '🇫🇮',
    'poland': '🇵🇱',
    'ukraine': '🇺🇦',
    'saudi arabia': '🇸🇦',
    'egypt': '🇪🇬',
    'pakistan': '🇵🇰',
    'bangladesh': '🇧🇩',
    'indonesia': '🇮🇩',
    'malaysia': '🇲🇾',
    'philippines': '🇵🇭',
    'vietnam': '🇻🇳',
    'thailand': '🇹🇭',
    'israel': '🇮🇱',
    'lebanon': '🇱🇧',
    'qatar': '🇶🇦',
    'kuwait': '🇰🇼',
    'oman': '🇴🇲',
    'bahrain': '🇧🇭'
};

function getCountryFlag(countryName) {
    if (!countryName) return '🏴';
    const lowerName = countryName.toLowerCase().trim();
    if (countryFlags[lowerName]) {
        return countryFlags[lowerName];
    }
    for (const [country, flag] of Object.entries(countryFlags)) {
        if (lowerName.includes(country) || country.includes(lowerName)) {
            return flag;
        }
    }

    return '🏴';
}

function injectBadge(country, locationAccurate = true) {
    const header = document.querySelector('div[data-testid="UserName"]');
    if (!header) return;

    const existingBadge = document.getElementById("country-badge");
    if (existingBadge) existingBadge.remove();

    const badge = document.createElement("div");
    badge.id = "country-badge";

    const flag = getCountryFlag(country);
    const displayText = country === "error" ? "Error loading" :
        country === "نامشخص" ? "Unknown location" : country;
    const vpnClass = !locationAccurate ? 'vpn-warning' : 'vpn-success';
    const vpnIcon = !locationAccurate ? '⚠️' : '✅';
    const vpnText = !locationAccurate ? 'VPN/Proxy/Warp detected' : 'No VPN/Proxy/Warp detected.';

    badge.innerHTML = `
  <div class="badge-container">
    <div class="main-badge">
      <span class="badge-flag" style="display:none;">${country === "error" ? "❌" : flag}</span>
      <span class="badge-text">${displayText}</span>
    </div>
    <div class="${vpnClass}">
      <span class="vpn-icon">${vpnIcon}</span>
      <span class="vpn-text">${vpnText}</span>
    </div>
  </div>
`;


    const style = document.createElement('style');
    style.innerHTML = `
    #country-badge {
      font-family: system-ui, sans-serif;
      margin-top: 4px;
    }
    .badge-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .main-badge {
      text-align:center;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: linear-gradient(135deg, #1d9bf0, #1a8cd8);
      color: #fff;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(29, 155, 240, 0.3);
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .main-badge:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(29, 155, 240, 0.4);
    }
    .badge-flag {
      font-size: 16px;
    }
    .vpn-warning {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: rgba(255, 193, 7, 0.15);
      color: #ffa000;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(255, 193, 7, 0.3);
      max-width: fit-content;
    }
    .vpn-success {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: rgba(255, 193, 7, 0.15);
      color: #00f33dff;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid rgba(255, 193, 7, 0.3);
      max-width: fit-content;
    }
    .vpn-icon {
      font-size: 12px;
    }
    .vpn-text {
      line-height: 1;

    }
  `;

    document.head.appendChild(style);

    const usernameElement = header.querySelector('span[dir="ltr"]');
    if (usernameElement) {
        usernameElement.parentNode.appendChild(badge);
    } else {
        header.appendChild(badge);
    }
}


function injectErrorBadge() {
    const header = document.querySelector('div[data-testid="UserName"]');
    if (!header) return;

    const existingBadge = document.getElementById("country-badge");
    if (existingBadge) {
        existingBadge.remove();
    }

    const badge = document.createElement("div");
    badge.id = "country-badge";

    badge.innerHTML = `
    <div style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: linear-gradient(135deg, #ff4444, #cc3333); color: white; border-radius: 20px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3); border: 1px solid rgba(255,255,255,0.2);">
      <span style="font-size: 16px;">⚠️</span>
      <span>Error loading location</span>
    </div>
  `;

    badge.style.transition = "all 0.3s ease";
    badge.addEventListener('mouseenter', function () {
        this.style.transform = "scale(1.05)";
        this.style.boxShadow = "0 4px 12px rgba(255, 68, 68, 0.4)";
    });
    badge.addEventListener('mouseleave', function () {
        this.style.transform = "scale(1)";
        this.style.boxShadow = "0 2px 8px rgba(255, 68, 68, 0.3)";
    });

    const usernameElement = header.querySelector('span[dir="ltr"]');
    if (usernameElement) {
        usernameElement.parentNode.appendChild(badge);
    } else {
        header.appendChild(badge);
    }
}

async function fetchProfile(screenName) {
    try {
        const tokens = await new Promise((resolve) => {
            chrome.runtime.sendMessage("GET_TOKENS", resolve);
        });

        if (!tokens?.bearer || !tokens?.csrf) {
            console.error("No tokens available");
            return null;
        }

        const variables = {
            screenName: screenName
        };

        const features = {
            "responsive_web_graphql_exclude_directive_enabled": true,
            "verified_phone_label_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "communities_web_enable_tweet_community_results_fetch": true,
            "c9s_tweet_anatomy_moderator_badge_enabled": true,
            "articles_preview_enabled": true
        };

        const url = `https://x.com/i/api/graphql/zs_jFPFT78rBpXv9Z3U2YQ/AboutAccountQuery?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": tokens.bearer,
                "x-csrf-token": tokens.csrf,
                "content-type": "application/json",
                "x-twitter-client-language": "en"
            },
            credentials: "include"
        });

        if (!res.ok) {
            console.error("API request failed:", res.status);
            return null;
        }

        const data = await res.json();
        console.log("Full API Response:", data);

        try {
            const aboutProfile = data?.data?.user_result_by_screen_name?.result?.about_profile;
            if (aboutProfile) {
                return {
                    country: aboutProfile.account_based_in,
                    locationAccurate: aboutProfile.location_accurate
                };
            }
            return null;
        } catch (parseError) {
            console.error("Error parsing response:", parseError);
            return null;
        }

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

function extractFromPage() {
    try {
        const locationElement = document.querySelector('[data-testid="UserLocation"]');
        if (locationElement) {
            const locationText = locationElement.textContent.trim();
            if (locationText && locationText.length > 0) {
                return {
                    country: locationText,
                    locationAccurate: true
                };
            }
        }

        const bioElement = document.querySelector('[data-testid="UserDescription"]');
        if (bioElement) {
            const bioText = bioElement.textContent.toLowerCase();

            const countryKeywords = Object.keys(countryFlags);
            for (const country of countryKeywords) {
                if (bioText.includes(country)) {
                    return {
                        country: country.charAt(0).toUpperCase() + country.slice(1),
                        locationAccurate: true
                    };
                }
            }

            // Check for common city/country patterns
            const cityCountryPattern = /(tehran|iran|usa|canada|uk|germany|france|turkey|uae|india|china)/i;
            const match = bioText.match(cityCountryPattern);
            if (match) {
                return {
                    country: match[0].charAt(0).toUpperCase() + match[0].slice(1),
                    locationAccurate: true
                };
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

async function run() {
    const username = extractUsername();

    if (!username || processedUsers.has(username) || isFetching) {
        return;
    }

    isFetching = true;
    processedUsers.add(username);

    try {
        console.log("Fetching country for:", username);
        let profileInfo = await fetchProfile(username);
        if (!profileInfo) {
            console.log("Trying to extract from page content...");
            profileInfo = extractFromPage();
        }

        if (profileInfo && profileInfo.country) {
            injectBadge(profileInfo.country, profileInfo.locationAccurate);
            console.log("Country found:", profileInfo.country, "Accurate:", profileInfo.locationAccurate);
        } else {
            injectBadge("نامشخص", true);
            console.log("Country not found");
        }
    } catch (error) {
        console.error("Error in run function:", error);
        injectErrorBadge();
    } finally {
        isFetching = false;
    }
}

const obs = new MutationObserver(function (mutations) {
    const header = document.querySelector('div[data-testid="UserName"]');
    const hasBadge = document.getElementById("country-badge");

    if (header && !hasBadge) {
        setTimeout(run, 1500);
    }
});

obs.observe(document.body, {
    subtree: true,
    childList: true
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(run, 2500);
    });
} else {
    setTimeout(run, 2500);
}

console.log("🇺🇳 Country Badge Extension Loaded with VPN Detection!");