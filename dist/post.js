import { a as runAction, i as getUserAgent, l as getState, n as TOKEN_KEY, o as throwHttpErrorMessage, r as getTokensEndpoint, t as REGISTRY_URL_KEY, u as info } from "./chunk1.js";
//#region src/post.ts
runAction(cleanup);
async function cleanup() {
	const token = getState(TOKEN_KEY);
	const registryUrl = getState(REGISTRY_URL_KEY);
	if (!token) {
		info("No token to revoke");
		return;
	}
	await revokeToken(registryUrl, token);
}
async function revokeToken(registryUrl, token) {
	const tokensEndpoint = getTokensEndpoint(registryUrl);
	info(`Revoking trusted publishing token at ${tokensEndpoint}`);
	const response = await fetch(tokensEndpoint, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			...getUserAgent()
		}
	});
	if (!response.ok) await throwHttpErrorMessage("Failed to revoke token", response);
	info("Token revoked successfully");
}
//#endregion
export { cleanup };
