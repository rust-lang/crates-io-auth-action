"use strict";Object.defineProperty(exports, "__esModule", {value: true});








var _chunk1js = require('./chunk1.js');

// src/post.ts
var core = _chunk1js.__toESM.call(void 0, _chunk1js.require_core.call(void 0, ));
_chunk1js.runAction.call(void 0, cleanup);
async function cleanup() {
  const token = core.getState(_chunk1js.TOKEN_KEY);
  const registryUrl = core.getState(_chunk1js.REGISTRY_URL_KEY);
  if (!token) {
    core.info("No token to revoke");
    return;
  }
  await revokeToken(registryUrl, token);
}
async function revokeToken(registryUrl, token) {
  core.info("Revoking trusted publishing token");
  const tokensEndpoint = _chunk1js.getTokensEndpoint.call(void 0, registryUrl);
  core.info(`Revoking token at: ${tokensEndpoint}`);
  const response = await fetch(tokensEndpoint, {
    method: "DELETE",
    headers: {
      /* eslint-disable  @typescript-eslint/naming-convention */
      Authorization: `Bearer ${token}`,
      ..._chunk1js.getUserAgent.call(void 0, )
    }
  });
  if (!response.ok) {
    await _chunk1js.throwHttpErrorMessage.call(void 0, "Failed to revoke token", response);
  }
  core.info("Token revoked successfully");
}


exports.cleanup = cleanup;
