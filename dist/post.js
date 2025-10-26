const require_utils = require('./chunk1.js');

//#region src/post.ts
var import_core = /* @__PURE__ */ require_utils.__toESM(require_utils.require_core());
require_utils.runAction(cleanup);
async function cleanup() {
	const token = import_core.getState(require_utils.TOKEN_KEY);
	const registryUrl = import_core.getState(require_utils.REGISTRY_URL_KEY);
	if (!token) {
		import_core.info("No token to revoke");
		return;
	}
	await revokeToken(registryUrl, token);
}
async function revokeToken(registryUrl, token) {
	const tokensEndpoint = require_utils.getTokensEndpoint(registryUrl);
	import_core.info(`Revoking trusted publishing token at ${tokensEndpoint}`);
	const response = await fetch(tokensEndpoint, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			...require_utils.getUserAgent()
		}
	});
	if (!response.ok) await require_utils.throwHttpErrorMessage("Failed to revoke token", response);
	import_core.info("Token revoked successfully");
}

//#endregion
exports.cleanup = cleanup;