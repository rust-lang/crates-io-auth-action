"use strict";Object.defineProperty(exports, "__esModule", {value: true});








var _chunkOLZEGNJMjs = require('./chunk-OLZEGNJM.js');

// src/post.ts
var core = _chunkOLZEGNJMjs.__toESM.call(void 0, _chunkOLZEGNJMjs.require_core.call(void 0, ));
_chunkOLZEGNJMjs.runAction.call(void 0, cleanup);
async function cleanup() {
  const token = core.getState(_chunkOLZEGNJMjs.TOKEN_KEY);
  const registryUrl = core.getState(_chunkOLZEGNJMjs.REGISTRY_URL_KEY);
  if (!token) {
    core.info("No token to revoke");
    return;
  }
  await revokeToken(registryUrl, token);
}
async function revokeToken(registryUrl, token) {
  core.info("Revoking trusted publishing token");
  const tokensEndpoint = _chunkOLZEGNJMjs.getTokensEndpoint.call(void 0, registryUrl);
  core.info(`Revoking token at: ${tokensEndpoint}`);
  const response = await fetch(tokensEndpoint, {
    method: "DELETE",
    headers: {
      /* eslint-disable  @typescript-eslint/naming-convention */
      Authorization: `Bearer ${token}`,
      ..._chunkOLZEGNJMjs.getUserAgent.call(void 0, )
    }
  });
  if (!response.ok) {
    await _chunkOLZEGNJMjs.throwHttpErrorMessage.call(void 0, "Failed to revoke token", response);
  }
  core.info("Token revoked successfully");
}


exports.cleanup = cleanup;
