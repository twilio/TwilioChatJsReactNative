'use strict';

import { Client as TwilioChatClient } from "twilio-chat";
import { AccessManager as TwilioAccessManager} from "twilio-common";
import "react-native";

export default class ChatClientHelper {
  host;
  log;
  client;
  accessManager;

  constructor(tokenAndConfigurationProviderHost, log) {
    this.host = tokenAndConfigurationProviderHost;
    this.log = log;
    this.client = null;
    this.accessManager = null;
  }

  login(identity, pushChannel, registerForPushCallback, showPushCallback) {
    let that = this;
    return fetch(`${this.host}/chat-client-configuration.json`)
      .then((response) => {
        let chatClientConfig = response.json();
        that.log.info('login', 'Got Chat client configuration', chatClientConfig);
        return this.getToken(identity, pushChannel)
          .then(function(token) {
            that.log.info('ChatClientHelper', 'got chat token', token);
            return TwilioChatClient.create(token, chatClientConfig.options || {}).then((chatClient) => {
              that.client = chatClient;
              that.accessManager = new TwilioAccessManager(token);
              that.accessManager.on('tokenUpdated', am => that.client.updateToken(am.token));
              that.accessManager.on('tokenExpired', () =>
                that.getToken(identity, pushChannel)
                  .then(newData => that.accessManager.updateToken(newData)));
              that.client.on('pushNotification', obj => {
                if (obj && showPushCallback) {
                  showPushCallback(that.log, obj);
                }
              });
              that.subscribeToAllAccessManagerEvents();
              that.subscribeToAllChatClientEvents();
              if (registerForPushCallback) {
                registerForPushCallback(that.log, that.client);
              }
            });
          })
          .catch((err) => {
            that.log.error('login', 'can\'t get token', err);
          });
      })
      .catch((err) => {
        that.log.error('login', 'can\'t fetch Chat Client configuration', err);
      });
  };

  getToken(identity, pushChannel) {
    if (!pushChannel) {
      pushChannel = 'none';
    }
    return fetch(`${this.host}/token?identity=${identity}&pushChannel=${pushChannel}`)
      .then(response => {
        return response.text();
      });
  }

  subscribeToAllAccessManagerEvents() {
    this.accessManager.on('tokenUpdated', obj => this.log.event('ChatClientHelper.accessManager', 'tokenUpdated', obj));
    this.accessManager.on('tokenExpired', obj => this.log.event('ChatClientHelper.accessManager', 'tokenExpired', obj));
  }

  subscribeToAllChatClientEvents() {
    this.client.on('userSubscribed', obj => this.log.event('ChatClientHelper.client', 'userSubscribed', obj));
    this.client.on('userUpdated', obj => this.log.event('ChatClientHelper.client', 'userUpdated', obj));
    this.client.on('userUnsubscribed', obj => this.log.event('ChatClientHelper.client', 'userUnsubscribed', obj));
    this.client.on('channelAdded', obj => this.log.event('ChatClientHelper.client', 'channelAdded', obj));
    this.client.on('channelRemoved', obj => this.log.event('ChatClientHelper.client', 'channelRemoved', obj));
    this.client.on('channelInvited', obj => this.log.event('ChatClientHelper.client', 'channelInvited', obj));
    this.client.on('channelJoined', obj => this.log.event('ChatClientHelper.client', 'channelJoined', obj));
    this.client.on('channelLeft', obj => this.log.event('ChatClientHelper.client', 'channelLeft', obj));
    this.client.on('channelUpdated', obj => this.log.event('ChatClientHelper.client', 'channelUpdated', obj));
    this.client.on('memberJoined', obj => this.log.event('ChatClientHelper.client', 'memberJoined', obj));
    this.client.on('memberLeft', obj => this.log.event('ChatClientHelper.client', 'memberLeft', obj));
    this.client.on('memberUpdated', obj => this.log.event('ChatClientHelper.client', 'memberUpdated', obj));
    this.client.on('messageAdded', obj => this.log.event('ChatClientHelper.client', 'messageAdded', obj));
    this.client.on('messageUpdated', obj => this.log.event('ChatClientHelper.client', 'messageUpdated', obj));
    this.client.on('messageRemoved', obj => this.log.event('ChatClientHelper.client', 'messageRemoved', obj));
    this.client.on('typingStarted', obj => this.log.event('ChatClientHelper.client', 'typingStarted', obj));
    this.client.on('typingEnded', obj => this.log.event('ChatClientHelper.client', 'typingEnded', obj));
    this.client.on('connectionStateChanged', obj => this.log.event('ChatClientHelper.client', 'connectionStateChanged', obj));
    this.client.on('pushNotification', obj => this.log.event('ChatClientHelper.client', 'onPushNotification', obj));
  };
};
