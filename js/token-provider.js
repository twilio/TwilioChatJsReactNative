'use strict';

const Twilio = require('twilio');
const AccessToken = Twilio.jwt.AccessToken;
const credentialsFromFile = require('../configuration.json');

const TokenProvider = {
  getToken: function(identity, pushChannel, customTTL) {

    if (!pushChannel) {
      pushChannel = 'none';
    }

    if (!credentialsFromFile.tokenGenerator ||
      !credentialsFromFile.tokenGenerator.accountSid ||
      !credentialsFromFile.tokenGenerator.serviceSid ||
      !credentialsFromFile.tokenGenerator.signingKeySid ||
      !credentialsFromFile.tokenGenerator.signingKeySecret) {
      throw new Error(`${new Date()} [token-generator] [ERROR] No full credentials found in configuration.json`);
    }
    let token = new AccessToken(
      credentialsFromFile.tokenGenerator.accountSid,
      credentialsFromFile.tokenGenerator.signingKeySid,
      credentialsFromFile.tokenGenerator.signingKeySecret, {
        identity: identity,
        ttl: (Number.isInteger(customTTL) ? customTTL : 3600)
      });

    let grant = new AccessToken.ChatGrant({ serviceSid: credentialsFromFile.tokenGenerator.serviceSid });
    if (pushChannel && pushChannel !== 'none') {
      if (credentialsFromFile.tokenGenerator[pushChannel]) {
        grant.pushCredentialSid = credentialsFromFile.tokenGenerator[pushChannel];
      }
    }
    token.addGrant(grant);

    return token.toJwt();
  }
};

module.exports = TokenProvider;

