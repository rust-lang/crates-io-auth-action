import { a as runAction, c as getInput, d as saveState, f as setOutput, i as getUserAgent, n as TOKEN_KEY, o as throwHttpErrorMessage, p as setSecret, r as getTokensEndpoint, s as getIDToken, t as REGISTRY_URL_KEY, u as info } from "./chunk1.js";
//#region src/registry_url.ts
function getAudienceFromUrl(url) {
	const audience = url.replace(/^https?:\/\//, "");
	if (audience.startsWith("http://") || audience.startsWith("https://")) throw new Error("Bug: The audience should not include the protocol (http:// or https://).");
	return audience;
}
function getRegistryUrl() {
	const url = getInput("url") || "https://crates.io";
	if (url.endsWith("/")) return url.slice(0, -1);
	return url;
}
//#endregion
//#region src/main.ts
runAction(run);
async function run() {
	checkPermissions();
	const registryUrl = getRegistryUrl();
	const token = await requestTrustedPublishingToken(registryUrl, await getJwtToken(getAudienceFromUrl(registryUrl)));
	setTokenOutput(token);
	saveState(TOKEN_KEY, token);
	saveState(REGISTRY_URL_KEY, registryUrl);
}
/** Check that GitHub Actions workflow permissions are set correctly. */
function checkPermissions() {
	if (process.env.ACTIONS_ID_TOKEN_REQUEST_URL === void 0 || !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) throw new Error("Please ensure the 'id-token' permission is set to 'write' in your workflow. For more information, see: https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect#adding-permissions-settings");
}
async function getJwtToken(audience) {
	info(`Retrieving GitHub Actions JWT token with audience: ${audience}`);
	const jwtToken = await getIDToken(audience);
	if (!jwtToken) throw new Error("Failed to retrieve JWT token from GitHub Actions");
	info("Retrieved JWT token successfully");
	return jwtToken;
}
async function requestTrustedPublishingToken(registryUrl, jwtToken) {
	const tokenUrl = getTokensEndpoint(registryUrl);
	const userAgent = getUserAgent();
	info(`Requesting token from: ${tokenUrl}. User agent: ${userAgent["User-Agent"]}`);
	const response = await fetch(tokenUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...userAgent
		},
		body: JSON.stringify({ jwt: jwtToken })
	});
	if (!response.ok) await throwHttpErrorMessage("Failed to retrieve token from Cargo registry", response);
	const tokenResponse = await response.json();
	if (!tokenResponse.token) await throwHttpErrorMessage("Failed to retrieve token from the Cargo registry response body", response);
	info("Retrieved token successfully");
	return tokenResponse.token;
}
function setTokenOutput(token) {
	setSecret(token);
	setOutput(TOKEN_KEY, token);
}
//#endregion
export { run };
