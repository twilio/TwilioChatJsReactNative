import 'react-native';
import React from 'react';
import { Client as TwilioChatClient } from "twilio-chat";

const TokenProvider = require('../js/token-provider');

const clientOptions = { logLevel: 'silent' };

describe('Channels', function() {
  let clientAlice : TwilioChatClient = null;
  let clientBob : TwilioChatClient = null;

  beforeAll(async () => {
    let aliceToken = TokenProvider.getToken('alicetestuser', null);
    clientAlice = await TwilioChatClient.create(aliceToken, clientOptions);

    let bobToken = TokenProvider.getToken('bobtestuser', null);
    clientBob = await TwilioChatClient.create(bobToken, clientOptions);
  });

  afterAll(async () => {
    await clientAlice.shutdown();
    await clientBob.shutdown();
  });

  describe('Creating, joining channel and then leaving', function() {
    let channelUniqueNames = [];

    afterAll(async () => {
      for (let channelUniqueName of channelUniqueNames) {
        await clientAlice.getChannelByUniqueName(channelUniqueName)
          .then(channel => channel.delete())
          .catch(() => {
          });
      }
    });
    describe('Public channel', function() {
      it('Using getByUniqueName in between', async () => {
        let channelUniqueName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        channelUniqueNames.push(channelUniqueName);

        let channel = await clientAlice.createChannel({
                                                        isPrivate: false,
                                                        uniqueName: channelUniqueName
                                                      });
        await Promise.all([
                            new Promise(resolve => {
                              clientBob.on('channelJoined', joinedChannel => {
                                if (joinedChannel.sid === channel.sid) {
                                  resolve();
                                }
                              })
                            }),
                            clientBob.getChannelByUniqueName(channelUniqueName).then(channel => channel.join())
                          ]);

        await clientBob.getChannelByUniqueName(channelUniqueName).then(channel => channel.leave);
      });

      it('Promise chaining', async () => {
        let channelUniqueName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        channelUniqueNames.push(channelUniqueName);

        await clientAlice.createChannel({
                                          isPrivate: false,
                                          uniqueName: channelUniqueName
                                        })
          .then(channel => channel.join()
            .then(channel => channel.leave()));
      });
    });

    describe('Private channel', function() {
      it('Using getByUniqueName in between', async () => {
        let channelUniqueName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        channelUniqueNames.push(channelUniqueName);

        let channel = await clientAlice.createChannel({
                                                        isPrivate: true,
                                                        uniqueName: channelUniqueName
                                                      })
          .then(channel => channel.join());
        await Promise.all([
                            new Promise(resolve => {
                              clientBob.on('channelJoined', joinedChannel => {
                                if (joinedChannel.sid === channel.sid) {
                                  resolve();
                                }
                              })
                            }),
                            channel.add(clientBob.user.identity)
                          ]);

        await clientBob.getChannelByUniqueName(channelUniqueName).then(channel => channel.leave);
      });

      it('Promise chaining', async () => {
        let channelUniqueName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        channelUniqueNames.push(channelUniqueName);

        await clientAlice.createChannel({
                                          isPrivate: true,
                                          uniqueName: channelUniqueName
                                        })
          .then(channel => channel.join()
            .then(channel => channel.leave()));
      });
    });
  });
});

