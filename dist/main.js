"use strict";Object.defineProperty(exports, "__esModule", {value: true});








var _chunkOLZEGNJMjs = require('./chunk-OLZEGNJM.js');

// src/main.ts
var core2 = _chunkOLZEGNJMjs.__toESM.call(void 0, _chunkOLZEGNJMjs.require_core.call(void 0, ));

// src/registry_url.ts
var core = _chunkOLZEGNJMjs.__toESM.call(void 0, _chunkOLZEGNJMjs.require_core.call(void 0, ));
function getAudienceFromUrl(url) {
  const audience = url.replace(/^https?:\/\//, "");
  if (audience.startsWith("http://") || audience.startsWith("https://")) {
    throw new Error(
      "Bug: The audience should not include the protocol (http:// or https://)."
    );
  }
  return audience;
}
function getRegistryUrl() {
  const url = core.getInput("url") || "https://crates.io";
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
}

// src/main.ts
_chunkOLZEGNJMjs.runAction.call(void 0, run);
async function run() {
  checkPermissions();
  const registryUrl = getRegistryUrl();
  const audience = getAudienceFromUrl(registryUrl);
  const jwtToken = await getJwtToken(audience);
  const token = await requestTrustedPublishingToken(registryUrl, jwtToken);
  setTokenOutput(token);
  core2.saveState(_chunkOLZEGNJMjs.TOKEN_KEY, token);
  core2.saveState(_chunkOLZEGNJMjs.REGISTRY_URL_KEY, registryUrl);
}
function checkPermissions() {
  if (process.env.ACTIONS_ID_TOKEN_REQUEST_URL === void 0 || !process.env.ACTIONS_ID_TOKEN_REQUEST_URL) {
    throw new Error(
      "Please ensure the 'id-token' permission is set to 'write' in your workflow. For more information, see: https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect#adding-permissions-settings"
    );
  }
}
async function getJwtToken(audience) {
  core2.info(`Retrieving GitHub Actions JWT token with audience: ${audience}`);
  const jwtToken = await core2.getIDToken(audience);
  if (!jwtToken) {
    throw new Error("Failed to retrieve JWT token from GitHub Actions");
  }
  core2.info("Retrieved JWT token successfully");
  return jwtToken;
}
async function requestTrustedPublishingToken(registryUrl, jwtToken) {
  const tokenUrl = _chunkOLZEGNJMjs.getTokensEndpoint.call(void 0, registryUrl);
  const userAgent = _chunkOLZEGNJMjs.getUserAgent.call(void 0, );
  core2.info(
    `Requesting token from: ${tokenUrl}. User agent: ${userAgent["User-Agent"]}`
  );
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      /* eslint-disable  @typescript-eslint/naming-convention */
      "Content-Type": "application/json",
      ...userAgent
    },
    body: JSON.stringify({ jwt: jwtToken })
  });
  if (!response.ok) {
    await _chunkOLZEGNJMjs.throwHttpErrorMessage.call(void 0, 
      "Failed to retrieve token from Cargo registry",
      response
    );
  }
  const tokenResponse = await response.json();
  if (!tokenResponse.token) {
    await _chunkOLZEGNJMjs.throwHttpErrorMessage.call(void 0, 
      "Failed to retrieve token from the Cargo registry response body",
      response
    );
  }
  core2.info("Retrieved token successfully");
  return tokenResponse.token;
}
function setTokenOutput(token) {
  core2.setSecret(token);
  core2.setOutput(_chunkOLZEGNJMjs.TOKEN_KEY, token);
}


exports.run = run;
