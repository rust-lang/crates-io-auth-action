const require_utils = require('./chunk1.js');

//#region src/registry_url.ts
var import_core$1 = /* @__PURE__ */ require_utils.__toESM(require_utils.require_core());
function getAudienceFromUrl(url) {
	const audience = url.replace(/^https?:\/\//, "");
	if (audience.startsWith("http://") || audience.startsWith("https://")) throw new Error("Bug: The audience should not include the protocol (http:// or https://).");
	return audience;
}
function getRegistryUrl() {
	const url = import_core$1.getInput("url") || "https://crates.io";
	if (url.endsWith("/")) return url.slice(0, -1);
	return url;
}

//#endregion
//#region src/main.ts
var import_core = /* @__PURE__ */ require_utils.__toESM(require_utils.require_core());
require_utils.runAction(run);
async function run() {
	checkPermissions();
	const registryUrl = getRegistryUrl();
	const token = await requestTrustedPublishingToken(registryUrl, await getJwtToken(getAudienceFromUrl(registryUrl)));
	setTokenOutput(token);
	import_core.saveState(require_utils.TOKEN_KEY, token);
	import_core.saveState(require_utils.REGISTRY_URL_KEY, registryUrl);
}
/** Check that GitHub Actions workflow permissions are set correctly. */
function checkPermissions() {
	if (process.env.ACTIONS_ID_TOKEN_REQUEST_URL === void 0 || !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) throw new Error("Please ensure the 'id-token' permission is set to 'write' in your workflow. For more information, see: https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect#adding-permissions-settings");
}
async function getJwtToken(audience) {
	import_core.info(`Retrieving GitHub Actions JWT token with audience: ${audience}`);
	const jwtToken = await import_core.getIDToken(audience);
	if (!jwtToken) throw new Error("Failed to retrieve JWT token from GitHub Actions");
	import_core.info("Retrieved JWT token successfully");
	return jwtToken;
}
async function requestTrustedPublishingToken(registryUrl, jwtToken) {
	const tokenUrl = require_utils.getTokensEndpoint(registryUrl);
	const userAgent = require_utils.getUserAgent();
	import_core.info(`Requesting token from: ${tokenUrl}. User agent: ${userAgent["User-Agent"]}`);
	const response = await fetch(tokenUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...userAgent
		},
		body: JSON.stringify({ jwt: jwtToken })
	});
	if (!response.ok) await require_utils.throwHttpErrorMessage("Failed to retrieve token from Cargo registry", response);
	const tokenResponse = await response.json();
	if (!tokenResponse.token) await require_utils.throwHttpErrorMessage("Failed to retrieve token from the Cargo registry response body", response);
	import_core.info("Retrieved token successfully");
	return tokenResponse.token;
}
function setTokenOutput(token) {
	import_core.setSecret(token);
	import_core.setOutput(require_utils.TOKEN_KEY, token);
}

//#endregion
exports.run = run;